import { Injectable } from '@angular/core';

import { Observable, Subscription, of, Subject, BehaviorSubject, zip } from 'rxjs';
import { catchError, map, tap, debounceTime, distinctUntilChanged, switchMap, share, filter } from 'rxjs/operators';

import { UniverseService } from '../eve-angular-client/api/universe.service';
import { ApiHandlerService } from '../api-handler.service';
import { DataProviderService } from '../data-provider.service';

@Injectable({
  providedIn: 'root'
})

export class SharedMarketDataService {

  private subscription: Subscription;

  private childParams = new BehaviorSubject<any>(null);
  private marketHistory = new BehaviorSubject<any>(null);
  private marketBuyOrders = new BehaviorSubject<any>(null);
  private marketSellOrders = new BehaviorSubject<any>(null);
  private selectedView = new BehaviorSubject<any>(null);

  public childParams$ = this.childParams.asObservable().pipe(share());
  public marketHistory$ = this.marketHistory.asObservable().pipe(share());
  public marketBuyOrders$ = this.marketBuyOrders.asObservable().pipe(share());
  public marketSellOrders$ = this.marketSellOrders.asObservable().pipe(share());
  public selectedView$ = this.selectedView.asObservable();

  private locationIdObservable$ = [];
  private systemsIdObservable$ = [];

  constructor(
    private universeService: UniverseService,
    private apiHandlerService: ApiHandlerService,
    private dataProviderService: DataProviderService
  ) { }


  setChildParams(data: any) {
    this.childParams.next(data);
  }

  setMarketHistory(data: any): void {
    this.marketHistory.next(data);
  }

  setMarketOrders(data: any): void {
    this.refactorOrderData(data);
  }

  setSelectedView(data: string): void {
    this.selectedView.next(data);
  }

 refactorOrderData(data: any) {
    const dataLength = data.length;
    const associativObj = {};
    const sellOrder = [];
    const buyOrder = [];
    this.systemsIdObservable$ = [];
    this.locationIdObservable$ = [];
    const lang = this.dataProviderService.lang.getValue();
    const nonPublic = {
      'en-us': 'non public player structure',
      'de': 'nicht öffentliche Spielerstruktur',
      'fr': 'structure de joueur non publique',
      'ru': 'непубличная структура игрока',
      'zh': '非公共参与者结构',
      'ja': '非公開プレイヤー構造'
    };

    for (let i = 0; i < dataLength; i++) {

      if (associativObj[data[i].system_id] === undefined) {
        associativObj[data[i].system_id] = {};
        associativObj[data[i].system_id][data[i].location_id] = [i];
        if (data[i].location_id >= 1000000000000) {
          this.locationIdObservable$.push(this.apiHandlerService.getStructureData(data[i].location_id));
          this.systemsIdObservable$.push(
            this.universeService.getUniverseSystemsSystemId(data[i].system_id, undefined, undefined, undefined, lang)
          );
        } else {
          this.locationIdObservable$.push(this.universeService.getUniverseStationsStationId(data[i].location_id));
          this.systemsIdObservable$.push(
            this.universeService.getUniverseSystemsSystemId(data[i].system_id, undefined, undefined, undefined, lang)
          );
        }
      } else if (associativObj[data[i].system_id][data[i].location_id] === undefined) {
        associativObj[data[i].system_id][data[i].location_id] = [i];
        if (data[i].location_id >= 1000000000000) {
          this.locationIdObservable$.push(this.apiHandlerService.getStructureData(data[i].location_id));
        } else {
          this.locationIdObservable$.push(this.universeService.getUniverseStationsStationId(data[i].location_id));
        }
      } else {
        associativObj[data[i].system_id][data[i].location_id].push(i);
      }
    }

    const systemsData = zip(...this.systemsIdObservable$);
    const stationsData = zip(...this.locationIdObservable$);
    this.subscription = zip(systemsData, stationsData).subscribe((res: any) => {
      res[0].forEach(regionData => {
        res[1].forEach(stationData => {
          if (associativObj[regionData.system_id] !== undefined &&associativObj[regionData.system_id][stationData.station_id] !== undefined) {
            associativObj[regionData.system_id][stationData.station_id].forEach(index => {
              data[index].securityLevel = regionData.security_status;
              if (stationData.name === 'non public player structure') {
                data[index].stationName = `${regionData.name} - ${nonPublic[lang]}`;
              } else {
                data[index].stationName = stationData.name;
              }

              const timeDiff = ((new Date().getTime() - Date.parse(data[index].issued)) / 1000 );
              data[index].received = this.refactorDataDate(timeDiff);
              data[index].expire = this.refactorDataDate((data[index].duration * 24 * 60 * 60) - timeDiff);
              data[index].is_buy_order ? buyOrder.push(data[index]) : sellOrder.push(data[index]);
            });
          }
        });
      });
      console.log('shared market data: provide sell and buy order');
      this.marketSellOrders.next(sellOrder);
      this.marketBuyOrders.next(buyOrder);
      this.subscription.unsubscribe();
    });
  }


  refactorDataDate(time: any) {
    const day = Math.floor(time / 86400);
    const hour = Math.floor(time / 3600) % 24;
    const min = Math.floor(time / 60) % 60;
    const sec = Math.floor(time % 60);

    if (day >= 1 ) {
      return `${day}d ${hour}h ${min}m ${sec}s`;
    } else if (hour >= 1) {
      return `${hour}h ${min}m ${sec}s`;
    } else if (min >= 1) {
      return `${min}m ${sec}s`;
    } else {
      return `${sec}s`;
    }
  }
}
