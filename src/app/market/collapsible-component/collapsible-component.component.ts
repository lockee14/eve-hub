import { Component, OnInit, Input } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';

import { ApiHandlerService } from '../../api-handler.service';
import { DataProviderService } from '../../data-provider.service';
import { SharedMarketDataService } from '../shared-market-data.service';

@Component({
  selector: 'app-collapsible-component',
  templateUrl: './collapsible-component.component.html',
  styleUrls: ['./collapsible-component.component.css']
})
export class CollapsibleComponentComponent implements OnInit {
  @Input() marketGroup: any;
  @Input() region: number;
  public isActivated: boolean;
  public lang: Observable<string>;
  public itemLang: Observable<string>;
  private marketGroups: any;
  public selectedView$: Observable<string>;
  private clicked: boolean = false;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private sharedMarketDataService: SharedMarketDataService,
    private dataProviderService: DataProviderService
  ) { }

  ngOnInit() {
    this.lang = this.dataProviderService.lang$;
    this.itemLang = this.dataProviderService.lang$.pipe(
      map(x => {
        return x === 'en-us' ? 'en' : x;
      })
    );
    this.selectedView$ = this.sharedMarketDataService.selectedView$.pipe(
      map(x => x === null ? 'chart' : x),
      delay(0));
  }

  getMarketGroup(parentId): void {
    this.apiHandlerService.getMarketGroup(parentId)
    .subscribe(data => this.marketGroups = data);
  }

  toggleActivate() {
    !this.isActivated ? this.getMarketGroup(this.marketGroup.marketGroupID) : null;
    this.isActivated = !this.isActivated;
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

  rotateCross(event) {
    event.stopPropagation();
    if (this.clicked) {
      this.clicked = false;
      event.target.parentNode.querySelector('#cross-vert').style.transform = 'rotate(0deg)';
    } else {
      this.clicked = true;
      event.target.parentNode.querySelector('#cross-vert').style.transform = 'rotate(270deg)';
    }
  }
}
