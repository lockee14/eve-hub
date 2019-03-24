import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subscription, BehaviorSubject } from 'rxjs';

import { ApiHandlerService } from '../api-handler.service';
import { REGEXS } from './regex-list';

@Injectable({
  providedIn: 'root'
})

export class AppraisalService implements OnDestroy {

  private subscribtion: Subscription[] = [];
  private appraisal = new BehaviorSubject(null);
  private regexs = REGEXS;

  public appraisal$: Observable<any> = this.appraisal.asObservable();

  constructor(
    private apiHandlerService: ApiHandlerService
    ) { }

  ngOnDestroy() {
    this.subscribtion.forEach(element => {
      element.unsubscribe();
    });
  }

  handleData(region: any, list: string) {
    const parsedList = this.parser(list);
    const date = Date.now();
    const toAppraise: any[] = [region, parsedList[0], parsedList[1], parsedList[2], date, list];
    const sub = this.apiHandlerService.postItemsList(toAppraise)
    .subscribe(data => {
      if (typeof data === 'string') {
        return;
      }
      data.forEach((element, i) => {
        if ( i === 0 ) { return; }
        data[i].totalBuyPrice = this.preciseRound(element.price.buy * element.quantity, 2);
        data[i].totalSellPrice = this.preciseRound(element.price.sell * element.quantity, 2);
        data[i].buyIskPerVol = this.preciseRound(element.price.buy / element.volume, 2);
        data[i].sellIskPerVol = this.preciseRound(element.price.sell / element.volume, 2);
      });
      this.appraisal.next(data);
    });
    this.subscribtion.push(sub);
    function preciseRound(number, precise) {
      const factor = Math.pow(10, precise);
      return (Math.round(number * factor) / factor);
    }

  }

  preciseRound(number, precise) {
    const factor = Math.pow(10, precise);
    return (Math.round(number * factor) / factor);
  }

  getOldAppraisal(hash) {
    const sub = this.apiHandlerService.getItemsList(hash)
    .subscribe(data => {
      data.forEach((element, i) => {
        if ( i === 0 ) { return; }
        data[i].totalBuyPrice = this.preciseRound(element.price.buy * element.quantity, 2);
        data[i].totalSellPrice = this.preciseRound(element.price.sell * element.quantity, 2);
        data[i].buyIskPerVol = this.preciseRound(element.price.buy / element.volume, 2);
        data[i].sellIskPerVol = this.preciseRound(element.price.sell / element.volume, 2);
      });
      this.appraisal.next(data);
    });
    this.subscribtion.push(sub);
  }

  parser(data): any {
    const result: any = {};
    const error: number[] = [];
    let numberOfProp: number = 0;
    const lines: string[] = data.split('\n');
    lines.forEach((line, i) => {
      let test = null;
      for (const regex in this.regexs) {

        if (test = line.match(this.regexs[regex])) {

          let itemName = test[1].trim().toLowerCase();
          if (regex === 'planetary_interaction' || regex === 'quantity_name') {

            itemName = test[2].trim().toLowerCase();
            if (itemName in result) {
              result[itemName] += parseInt(test[1].replace(/,|\xA0|'/g, ''), 10);
            } else {
              result[itemName] = parseInt(test[1].replace(/,|\xA0|'/g, ''), 10);
              numberOfProp++;
            }
            break;

          } else if (regex === 'compare' || regex === 'just_name') {

            if (itemName in result) {
              result[itemName] += 1;
            } else {
              result[itemName] = 1;
              numberOfProp++;
            }
            break;

          } else {

            if (itemName in result) {
              result[itemName] += parseInt(test[2].replace(/,|\xA0|'/g, ''), 10);
            } else {
              result[itemName] = parseInt(test[2].replace(/,|\xA0|'/g, ''), 10);
              numberOfProp++;
            }
            break;

          }
        }
      }
      if (test === null) { error.push(i); }
    });

    return [result, numberOfProp, error];


  }
}
