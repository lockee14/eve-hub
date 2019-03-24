import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {MatSort, MatTableDataSource} from '@angular/material';

import { Observable, Subscription } from 'rxjs';

import { SharedMarketDataService } from '../shared-market-data.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  public marketSellOrders: any;
  private parametres$: Observable<any>;
  public isTrue: boolean = false;

  public columnsToDisplay: string[] = ['volume', 'price', 'location', 'expire', 'received'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private route: ActivatedRoute,
    private sharedMarketDataService: SharedMarketDataService
  ) { }

  ngOnInit() {
    this.parametres$ = this.route.params;
    const sub = this.parametres$.subscribe(params => this.sharedMarketDataService.setChildParams(params));
    this.subscription.push(sub);
    this.sharedMarketDataService.setSelectedView('sell');
    this.fetchData();
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }

  fetchData(): void {
    const sub = this.sharedMarketDataService.marketSellOrders$.subscribe(data => {
      this.isTrue = true;
      if (data !== null) {
        this.marketSellOrders = new MatTableDataSource(data);
        this.marketSellOrders.sort = this.sort;
      }
    });
    this.subscription.push(sub);
  }
}
