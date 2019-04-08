import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Observable, Subscription, zip, combineLatest } from 'rxjs';
import { switchMap, filter, skipWhile, distinctUntilChanged } from 'rxjs/operators';

import { SharedMarketDataService } from '../shared-market-data.service';
import { DataProviderService } from './../../data-provider.service';
import { createElement } from '@angular/core/src/view/element';

// declare var initialisation: any; // ancienne version de chartlib fait en javascript avec svg
declare var chartlib_canvas: any; // nouvelle version de chartlib fait en typescript avec canvas

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  private parametres$: Observable<any>;
  private supercontenaire: HTMLElement;

  constructor(
    private sharedMarketDataService: SharedMarketDataService,
    private dataProviderService: DataProviderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.parametres$ = this.route.params;
    const sub = this.parametres$.subscribe( params => this.sharedMarketDataService.setChildParams(params));
    this.subscription.push(sub);
    this.sharedMarketDataService.setSelectedView('chart');
    this.supercontenaire = document.getElementById('supercontenaire');
    this.fetchData();
  }

  ngOnDestroy() { // remove add event listener from chartlib_canvas
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }

  fetchData(): void {
    const data = this.sharedMarketDataService.marketHistory$.pipe(filter(x => x !== null), distinctUntilChanged());
    const lang = this.dataProviderService.lang$;
    const sub = combineLatest(data, lang).subscribe(([d, l]) => {
      this.supercontenaire.innerHTML = '';
      chartlib_canvas(d, l);
    });
    this.subscription.push(sub);
  }
}
