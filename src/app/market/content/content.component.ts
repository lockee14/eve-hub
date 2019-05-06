import { Component, OnInit, Input, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
// import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FocusMonitor } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';

import { Observable, Subject, Subscription, observable, BehaviorSubject, zip, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map, tap, share, delay } from 'rxjs/operators';

import { Overlay } from '@angular/cdk/overlay';

import { ApiHandlerService } from '../../api-handler.service';
import { MarketService } from '../../eve-angular-client/api/market.service';
import { SharedMarketDataService } from '../shared-market-data.service';
import { DataProviderService } from '../../data-provider.service';

import { i18n_REGIONS } from '../../i18n_regions-list';

interface InfoData {
  description: {
    en: string;
    fr: string;
    de: string;
    ru: string;
    zh: string;
    jp: string;
  };
  groupID: number;
  iconID: number;
  id: number;
  marketGroupID: number;
  name: {
    en: string;
    fr: string;
    de: string;
    ru: string;
    zh: string;
    jp: string;
  };
  volume: number;
}

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
  // public i18n_selectedRegion: number = 10000002; // pourquoi je le stock sous forme nombre?
  public i18n_selectedRegion: number = 10000000; // all regions
  public isActivated: boolean;

  public items$: Observable<any[]>;
  public searchTerms = new Subject<string>();

  private childRegion = new BehaviorSubject(null);
  private childItem = new BehaviorSubject(null);

  public childItem$ = this.childItem.asObservable().pipe(
    switchMap(x => {
      if (x !== null) {
        return this.apiHandlerService.getMarketItem(x);
      } else {
        return of(null);
      }
    })
  );

  public myControl = new FormControl();

  public selectedView$: Observable<string>;
  public lang$: Observable<String>;

  constructor(
    private apiHandlerService: ApiHandlerService,
    // private route: ActivatedRoute,
    // private router: Router,
    private sharedMarketDataService: SharedMarketDataService,
    private overlay: Overlay,
    private marketService: MarketService,
    private dataProviderService: DataProviderService,
    public dialog: MatDialog,
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
    this.sharedMarketDataService.setChildParams(null);
  }

  search(term: string) {
    this.searchTerms.next(term);
  }

  getMarketGroup(): void {
    this.apiHandlerService.getMarketGroup(undefined)
    .subscribe(data => this.marketGroups = data);
  }

  openInfoDialog(data: InfoData): void {
    this.dialog.open(DialogInfoComponent, {
      id: 'dialog-info',
      ariaDescribedBy: 'InfoId',
      width: '50vw',
      // height: '600px',
      panelClass: 'dialog-info',
      data: data
    });
  }

  setChildData(): void {
    this.subscription = this.sharedMarketDataService.childParams$.pipe(
      switchMap(params => { // je devrais verifier que les parametre sont valide
        if (params !== null && (this.childRegion.getValue() !== params.regionId || this.childItem.getValue() !== params.itemId) && this.i18n_regions.hasOwnProperty(params.regionId)) {
          setTimeout(() => this.childRegion.next(params.regionId)); // sert à eviter ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => this.childItem.next(params.itemId)); // sert à eviter ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => this.i18n_selectedRegion = ~~params.regionId); // sert à eviter ExpressionChangedAfterItHasBeenCheckedError
          if (params.regionId === '10000000') {
            const regionsHistory = [];
            const regionsOrders = [];
            for (const regionId in this.i18n_regions) {
              if (regionId === '10000000') { continue; }
              regionsHistory.push(this.marketService.getMarketsRegionIdHistory(~~regionId, params.itemId));
              regionsOrders.push(this.marketService.getMarketsRegionIdOrders('all', ~~regionId, undefined, undefined, undefined, params.itemId));
            }
            return zip(of('all'), zip(...regionsHistory), zip(...regionsOrders));
          } else {
            const obs1 = this.marketService.getMarketsRegionIdHistory(params.regionId, params.itemId);
            const obs2 = this.marketService.getMarketsRegionIdOrders('all', params.regionId, undefined, undefined, undefined, params.itemId);
            return zip(of('region'), obs1, obs2);
          }
        } else {
          return [null];
        }
      }),
      share()
    ).subscribe(data => {
      if (data !== null) {
        if (data[0] === 'all') {
          this.sharedMarketDataService.processUniverseHistory(data[1]);
          this.sharedMarketDataService.processUniverseOrders(data[2]);
        } else {
          this.sharedMarketDataService.setMarketHistory(data[1]);
          this.sharedMarketDataService.setMarketOrders(data[2]);
        }
        // this.sharedMarketDataService.setMarketHistory(data[0]);
        // this.sharedMarketDataService.setMarketOrders(data[1]);
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

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.css']
})


export class DialogInfoComponent implements OnInit {
  constructor(
    private dataProviderService: DataProviderService,
    public dialogRef: MatDialogRef<DialogInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InfoData,
    private focusMonitor: FocusMonitor,
    protected sanitizer: DomSanitizer
    ) {}

  public lang$: Observable<String>;

  ngOnInit() {
    // this.data.description.en = this.markupParser(this.data.description.en);
    this.lang$ = this.dataProviderService.lang$.pipe(map(x => x === 'en-us' ? 'en' : x));
    this.focusMonitor.stopMonitoring(document.getElementById('close-cross'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  markupParser(body): SafeHtml { // ça a l'air de fonctionner correctement >> en faire un service car je le retrouve dans 2 endroit different
    let regex: RegExp;
    body = body.replace(/<font ((size=('|"|)\d{1,2}('|"|) color=('|"|)(#\w{6,8}|\w+)('|"|))|(color=('|"|)(#\w{6,8}|\w+)('|"|) size=('|"|)\d{1,2}('|"|))|(size=('|"|)\d{1,2}('|"|)|color=('|"|)(#\w{6,8}|\w+)('|"|)))>/g, function(match) {
      match = match.replace(/(?:size=(?:"|'|))(\d{1,2})(?=(?:"|'|))/, (m, p1) => {
        const p = ~~p1 / 4;
        return p;
      });
      match = match.replace(/(?:color=(?:'|"|)#)(\w{8})(?=(?:'|"|))/, (m, p1) => p1.substring(2));
      return match;
    });
    regex = /((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    body = body.replace(/<a href="\S+">/g, function(match) {
      return regex.test(match) ? match : '';
    });
    regex = /(?:<)(url=)(?=(((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))>)/g;
    body = body.replace(regex, '<a href=');
    body = body.replace(/(?:<\/)(url)(?=>)/g, '</a');
    // return body;
    return this.sanitizer.bypassSecurityTrustHtml(body);
  }
}

