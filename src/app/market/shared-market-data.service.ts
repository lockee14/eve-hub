import { Injectable } from '@angular/core';

import { Observable, Subscription, of, Subject, BehaviorSubject, zip } from 'rxjs';
import { catchError, map, tap, debounceTime, distinctUntilChanged, switchMap, share, filter } from 'rxjs/operators';

import { UniverseService } from '../eve-angular-client/api/universe.service';
import { ApiHandlerService } from '../api-handler.service';
import { DataProviderService } from '../data-provider.service';

interface MarketsRegionHistory {
  average: number;
  date: string;
  highest: number;
  lowest: number;
  order_count: number;
  volume: number;
}

interface MarketsRegionOrders {
  duration: number;
  expire: string;
  is_buy_order: boolean;
  issued: string;
  location_id: number;
  min_volume: number;
  order_id: number;
  price: number;
  range: string;
  received: string;
  securityLevel: number;
  stationName: string;
  system_id: number;
  type_id: number;
  volume_remain: number;
  volume_total: number;
}

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
  private selectedItemData = new BehaviorSubject<any>(null);

  public childParams$ = this.childParams.asObservable().pipe(share());
  public marketHistory$ = this.marketHistory.asObservable().pipe(share());
  public marketBuyOrders$ = this.marketBuyOrders.asObservable().pipe(share());
  public marketSellOrders$ = this.marketSellOrders.asObservable().pipe(share());
  public selectedView$ = this.selectedView.asObservable(); // .pipe(share()); // le share() empeche les urls de se mettre à jour dans collapsible component
  private selectedItemData$ = this.selectedItemData.asObservable();

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

  setMarketHistory(data: MarketsRegionHistory[]): void {
    this.marketHistory.next(data);
  }

  setMarketOrders(data: MarketsRegionOrders[]): void {
    this.refactorOrderData(data);
  }

  processUniverseHistory(data: MarketsRegionHistory[][]): void {
    this.refactorUniverseHistoryData(data);
    // bon deja il y a des trous
    // compilé les donnée par jour, ponderer les valeurs
  }

  processUniverseOrders(data: MarketsRegionOrders[][]): void {
    const dataLength = data.length;
    const array = [];
    for (let i = 0; i < dataLength; i++) {
      array.push(...data[i]);
    }
    this.refactorOrderData(array);
  }

  setSelectedView(data: string): void {
    this.selectedView.next(data);
  }

  setSelectedItem(data: any): void {
    this.selectedItemData.next(data);
  }
  /*
    le problem:
      data est un array contenant les données relatives à chaque ordre d'achat/vente
      néanmoins plusieurs ordre peuvent provenir de la même station/region
      donc ce que je veux faire:
        n'envoyé de requete que une fois par stations/regions puis distribuer les resultat aux ordres associé
      la solution:
        deja traiter achat et vente de la même maniere car si je les separe des requete seraient redondente
        ne les séparer qu'au dernier moment avant next(data)
        crée un object de type obj = {locationId: [array des ordre contenant ce locationId (ou leurs index)]}
        iteré sur la reponse puis sur obj en fonction de obj[reponse[i].locationId].foreach
  */

 refactorOrderData(data: MarketsRegionOrders[]) { // ça à l'air de fonctionner non caca ça ne fonctionne pas
    const dataLength = data.length;
    const associativObj = {};  // associate systemId to stationId and then to data index
    const sellOrder: MarketsRegionOrders[] = [];
    const buyOrder: MarketsRegionOrders[] = [];
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
    this.subscription = zip(systemsData, stationsData).subscribe((res: any) => { // pour les structure utiliser le search service
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

  refactorUniverseHistoryData(data: MarketsRegionHistory[][]) {
    // faire un object et y associé les date avec un array des donnée figurant à cette date
    // ponderer les données en fonction de la longueur de la date
    // ressortir le tout sous la forme d'un array de donnée ordonné
    // PROBLEM! comment gerer les valeurs extremes?
    // calculer la moyenne courante et virer ce qui est trop élevé?
    // tout simplement les laisser ce serai une perte d'information...
    const dataLength = data.length;
    const dataObject = {};
    for (let i = 0; i < dataLength; i++) {
      const subArrLength = data[i].length;
      for (let j = 0; j < subArrLength; j++) {
        if (dataObject.hasOwnProperty(data[i][j].date)) {
          dataObject[data[i][j].date].push(data[i][j]);
        } else {
          dataObject[data[i][j].date] = [data[i][j]];
        }
      }
    }
    const result: MarketsRegionHistory[] = [];
    for (const d in dataObject) {
      const l = dataObject[d].length;
      if (dataObject[d].length > 1) {
        const obj: MarketsRegionHistory = {
          average: 0,
          date: dataObject[d][0].date,
          highest: 0,
          lowest: 0,
          order_count: 0,
          volume: 0
        };
        for (let i = 0; i < l; i++) {
          obj.average += dataObject[d][i].average;
          obj.highest += dataObject[d][i].highest;
          obj.lowest += dataObject[d][i].lowest;
          obj.order_count += dataObject[d][i].order_count;
          obj.volume += dataObject[d][i].volume;
        }
        obj.average = obj.average / l;
        obj.highest = obj.highest / l;
        obj.lowest = obj.lowest / l;
        obj.order_count = obj.order_count / l;
        obj.volume = obj.volume / l;
        result.push(obj);
      } else {
        result.push(dataObject[d][0]);
      }
    }
    result.sort((a, b) => a > b ? 1 : a < b ? -1 : 0); // sort data by date
    this.marketHistory.next(result);
  }
}
