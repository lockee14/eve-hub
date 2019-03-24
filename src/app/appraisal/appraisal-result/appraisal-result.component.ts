import { Component, OnInit, OnDestroy, Input , Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FocusMonitor} from '@angular/cdk/a11y';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';

import { Observable, Subject, Subscription, observable, BehaviorSubject, zip, timer, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, tap, first, take } from 'rxjs/operators';

import { MarketService } from '../../eve-angular-client/api/market.service';
import { UniverseService } from '../../eve-angular-client/api/universe.service';
import { AppraisalService } from '../appraisal.service';
import { DataProviderService } from '../../data-provider.service';


export interface DialogData {
  hash: string;
  raw: string;
  json: string;
}

@Component({
  selector: 'app-appraisal-result',
  templateUrl: './appraisal-result.component.html',
  styleUrls: ['./appraisal-result.component.css']
})
export class AppraisalResultComponent implements OnInit, OnDestroy {
  private subscribtion: Subscription[] = [];
  private refreshPriceTimer: Subscription;
  private appraisal = new BehaviorSubject(null);
  public appraisals$: Observable<any> = this.appraisal.asObservable().pipe(
    tap(x => {
      if (x !== null) {
        for (const data of x) {
          this.loaded[data.name.en] = false;
        }
      }
    })
  );
  public loaded = {};
  private totalBuy: number;
  private totalSell: number;
  private totalVolume: number;
  private appraisalDate: Date;
  private appraisalRegion: string;
  private appraisalHash: string;
  public hasData: boolean = false;
  private HashNotFound: boolean = false;
  private currentData: boolean = false;
  private jsonData: string;
  private rawData: string;

  private bestPrice = {};
  private bestPrice$ = {};

  public disabled = true;

  constructor(
    private appraisalService: AppraisalService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private marketService: MarketService,
    private universeService: UniverseService,
    private dataProviderService: DataProviderService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  openDialog(): void {
    this.dialog.open(DialogTemplateComponent, {
      id: 'dialog-box',
      ariaDescribedBy: 'testId',
      width: '50vw',
      panelClass: 'dialog-box',
      data: {hash: this.appraisalHash, raw: this.rawData, json: this.jsonData}
    });
  }

  refreshPrice() {
    const data = JSON.parse(this.jsonData);
    const dataLength = data.length;
    const arr: any[] = [];
    data.forEach((element, i) => {
      if (i === 0 )  { return; }
      if (element.error) {
        arr.push(of({buy: 0, sell: 0}));
      } else {
        arr.push(this.marketService.getMarketsRegionIdOrders('all', element.regionId, undefined, undefined, undefined, element.id));
      }
    });
    zip(...arr).pipe(
      map(newPrices => {
        const result = [];
        newPrices.forEach(element => {
          result.push(this.processPrices(element));
        });
        this.appraisalDate = new Date();
        this.totalBuy = 0, this.totalSell = 0, this.totalVolume = 0;
        for (let i = 1; i < dataLength; i++) {
          data[i].price = result[i - 1];
          data[i].totalBuyPrice = this.preciseRound(result[i - 1].buy * data[i].quantity, 2);
          data[i].totalSellPrice = this.preciseRound(result[i - 1].sell * data[i].quantity, 2);
          data[i].buyIskPerVol = this.preciseRound(result[i - 1].buy / data[i].volume, 2);
          data[i].sellIskPerVol = this.preciseRound(result[i - 1].sell / data[i].volume, 2);
          this.totalBuy += data[i].totalBuyPrice > 0 ? (data[i].totalBuyPrice * data[i].quantity) : 0;
          this.totalSell += data[i].totalSellPrice > 0 ? (data[i].totalSellPrice * data[i].quantity) : 0;
          this.totalVolume += data[i].volume > 0 ? (data[i].volume * data[i].quantity) : 0;
        }
        this.totalBuy = this.preciseRound(this.totalBuy, 2);
        this.totalSell = this.preciseRound(this.totalSell, 2);
        this.totalVolume = this.preciseRound(this.totalVolume, 5);
        const newData = data.slice(1, data.length);
        this.jsonData = JSON.stringify(data);
        this.appraisal.next(newData);
        return newData;
      }),
      first(x => x)
    ).subscribe();
  }

  getCurrentPrices() {
    this.currentData = true;
    this.refreshPrice();
    for (const itemName in this.bestPrice) {
      this.getBestPrices(itemName);
    }
    this.refreshPriceTimer = timer(301000, 301000).subscribe(x => {
      this.refreshPrice();
      for (const itemName in this.bestPrice) {
        this.getBestPrices(itemName);
      }
    });
  }

  getOldPrices() {
    this.currentData = false;
    this.refreshPriceTimer.unsubscribe();
    this.fetchData();
  }

  initBestPrices(itemName, itemId, itemRegion, volume, quantity) {
    if (itemName in this.bestPrice) {
      return;
    } else {
      this.bestPrice[itemName] = {
        name: itemName,
        itemId: itemId,
        itemRegion: itemRegion,
        volume: volume,
        quantity: quantity,
        subject: new BehaviorSubject(null)
      };
      this.bestPrice$[itemName] = this.bestPrice[itemName].subject.asObservable();
      this.getBestPrices(itemName);
    }
  }

  getBestPrices(itemName) {
    const regionObj = {10000002: 'TheForge', 10000032: 'SinqLaison', 10000030: 'Heimatar', 10000042: 'Metropolis', 10000043: 'Domain' };
    const arr: any[] = [];
    const bestPrice = this.bestPrice;
    const lang = this.dataProviderService.lang.getValue();
    for (const regionId in regionObj) {
      if (~~regionId !== this.bestPrice[itemName].itemRegion) {
        const prom = function(marketService, processPrices, universeService, preciseRound) {
          return new Promise(function(res, rej) {
            marketService.getMarketsRegionIdOrders('all', ~~regionId, undefined, undefined, undefined, bestPrice[itemName].itemId)
            .pipe(
              switchMap( x => {
                let buySystem, sellSystem;
                const result = processPrices(x);
                result.region = regionObj[regionId];
                result.regionId = regionId;
                result.volume = bestPrice[itemName].volume;
                result.quantity = bestPrice[itemName].quantity;
                buySystem = result.buySystemId === undefined ? of(null)
                  : universeService.getUniverseSystemsSystemId(result.buySystemId, undefined, undefined, undefined, lang);
                sellSystem = result.buySystemId === undefined ? of(null)
                  : universeService.getUniverseSystemsSystemId(result.sellSystemId, undefined, undefined, undefined, lang);
                return zip(of(result), buySystem, sellSystem);
              }),
              first()
            ).subscribe(x => {
              const result = x[0];
              result.buySystem = x[1] === null ? {name: 'no buy order'} : x[1];
              result.sellSystem = x[2] === null ? {name: 'no sell order'} : x[2];
              result.totalBuyPrice = preciseRound(result.buy * result.quantity, 2);
              result.totalSellPrice = preciseRound(result.sell * result.quantity, 2);
              result.buyIskPerVol = preciseRound(result.buy / result.volume, 2);
              result.sellIskPerVol = preciseRound(result.sell / result.volume, 2);
              res(result);
            });
          });
        };
        arr.push(prom(this.marketService, this.processPrices, this.universeService, this.preciseRound));
      }
    }
    Promise.all(arr).then(function(values) {
      this.bestPrice[itemName].subject.next(values);
      this.loaded[itemName] = true;
    }.bind(this));
  }

  ngOnDestroy() {
    this.subscribtion.forEach(element => {
      element.unsubscribe();
    });
  }

  fetchData() {
    this.appraisalService.appraisal$.pipe(
      tap( data => {
        data ? this.appraisalDate = new Date(data[0].date) : null;
      }),
      map( data => {
        if (data === null) {
          return data;
        } else {
          this.totalBuy = 0, this.totalSell = 0, this.totalVolume = 0;
          data.forEach((element, i) => {
            if (i === 0) {
              if (element.HashNotFound) {
                this.HashNotFound = true;
                this.hasData = false;
                return;
              } else {
                this.HashNotFound = false;
                this.hasData = true;
                this.appraisalDate = new Date(element.date);
                this.appraisalHash = element.hash;
                this.appraisalRegion = element.region;
                this.rawData = element.rawData;
                this.location.go('appraisal/' + element.hash);
                return;
              }
            } else {
              this.totalBuy += element.totalBuyPrice > 0 ? (element.totalBuyPrice * element.quantity) : 0;
              this.totalSell += element.totalSellPrice > 0 ? (element.totalSellPrice * element.quantity) : 0;
              this.totalVolume += element.volume > 0 ? (element.volume * element.quantity) : 0;
            }
          });
          this.totalBuy = this.preciseRound(this.totalBuy, 2);
          this.totalSell = this.preciseRound(this.totalSell, 2);
          this.totalVolume = this.preciseRound(this.totalVolume, 5);
          const newData = data.slice(1, data.length);
          this.jsonData = JSON.stringify(data);
          this.appraisal.next(newData);
          return newData;
        }
      })
    ).subscribe();
  }

  preciseRound(number, precise) {
    const factor = Math.pow(10, precise);
    return (Math.round(number * factor) / factor);
  }

  processPrices(ordersdata) {
    let buyPrices = 0;
    let sellPrices = 0;
    let buySystemId;
    let sellSystemId;
    let itemId;
    for (const prop in ordersdata) {
      if (itemId === undefined) { itemId = ordersdata[prop].type_id; }
      if (ordersdata[prop].is_buy_order && (ordersdata[prop].price > buyPrices)) {
        buyPrices = ordersdata[prop].price;
        buySystemId = ordersdata[prop].system_id;
      } else if (!ordersdata[prop].is_buy_order && (sellPrices === 0 || ordersdata[prop].price < sellPrices)) {
        sellPrices = ordersdata[prop].price;
        sellSystemId = ordersdata[prop].system_id;
      }
    }
    return {buy: buyPrices, sell: sellPrices, buySystemId: buySystemId, sellSystemId: sellSystemId, itemId: itemId};
  }

}
@Component({
  selector: 'app-dialog-template',
  templateUrl: './dialog-template.component.html',
  styleUrls: ['./dialog-template.component.css']
})
export class DialogTemplateComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private focusMonitor: FocusMonitor
    ) {}

  ngOnInit() {
    this.focusMonitor.stopMonitoring(document.getElementById('close-cross'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
