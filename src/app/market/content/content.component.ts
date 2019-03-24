import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subject, Subscription, observable, BehaviorSubject, zip } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, tap, share, delay } from 'rxjs/operators';

import { Overlay } from '@angular/cdk/overlay';

import { ApiHandlerService } from '../../api-handler.service';
import { MarketService } from '../../eve-angular-client/api/market.service';
import { SharedMarketDataService } from '../shared-market-data.service';
import { DataProviderService } from '../../data-provider.service';

import { i18n_REGIONS } from '../../i18n_regions-list';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  public i18n_regions = i18n_REGIONS;
  public marketGroups: any[];
  public i18n_selectedRegion: number = 10000002;
  public isActivated: boolean;

  public items$: Observable<any[]>;
  public searchTerms = new Subject<string>();

  public childRegion = new BehaviorSubject(null);
  public childItem = new BehaviorSubject(null);

  public myControl = new FormControl();

  public selectedView$: Observable<string>;
  public lang$: Observable<String>;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private sharedMarketDataService: SharedMarketDataService,
    private overlay: Overlay,
    private marketService: MarketService,
    private dataProviderService: DataProviderService
  ) { }


  ngOnInit(): void {
    this.lang$ = this.dataProviderService.lang$.pipe(map(x => x === 'en-us' ? 'en' : x));
    this.selectedView$ = this.sharedMarketDataService.selectedView$.pipe(
      map(x => x === null ? 'chart' : x),
      delay(0));
    this.setChildData();

    this.isActivated = false;
    this.getMarketGroup();
    this.items$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.apiHandlerService.search(term)),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  search(term: string) {
    this.searchTerms.next(term);
  }

  getMarketGroup(): void {
    this.apiHandlerService.getMarketGroup(undefined)
    .subscribe(data => this.marketGroups = data);
  }

  setChildData(): void {
    this.subscription = this.sharedMarketDataService.childParams$.pipe(
      switchMap(params => {
        if (params !== null && (this.childRegion.getValue() !== params.regionId || this.childItem.getValue() !== params.itemId)) {
          setTimeout(() => this.childRegion.next(params.regionId)); // sert à eviter ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => this.childItem.next(params.itemId)); // sert à eviter ExpressionChangedAfterItHasBeenCheckedError
          const obs1 = this.marketService.getMarketsRegionIdHistory(params.regionId, params.itemId);
          const obs2 = this.marketService.getMarketsRegionIdOrders('all', params.regionId, undefined, undefined, undefined, params.itemId);
          if (this.i18n_regions.hasOwnProperty(~~params.regionId)) {
            setTimeout(() => this.i18n_selectedRegion = ~~params.regionId);
          }
          return zip(obs1, obs2);
        } else {
          return [null];
        }
      }),
      share()
    ).subscribe(data => {
      if (data !== null) {
        this.sharedMarketDataService.setMarketHistory(data[0]);
        this.sharedMarketDataService.setMarketOrders(data[1]);
      }
    });
  }

  toggleActivate() {
    this.isActivated = !this.isActivated;
  }

  byId(item1: any, item2: any) {
    return item1 && item2 ? ~~item1 === ~~item2 : false;
  }

  scrollDown() {
    if ((typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
      const y = document.getElementById('left-part').clientHeight;
      window.scrollTo({
        left: 0,
        top: y,
        behavior: 'smooth'
      });
    }
  }
}

