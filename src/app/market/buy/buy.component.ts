import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import {MatSort, MatTableDataSource} from '@angular/material';

import { Observable, Subscription } from 'rxjs';

import { SharedMarketDataService } from '../shared-market-data.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  public marketBuyOrders: any;
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
    this.sharedMarketDataService.setSelectedView('buy');
    this.fetchData();
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }

  fetchData(): void {
    const sub = this.sharedMarketDataService.marketBuyOrders$.subscribe(data => {
      this.isTrue = true;
      if (data !== null) {
        this.marketBuyOrders = new MatTableDataSource(data);
        this.marketBuyOrders.sort = this.sort;
      }
    });
    this.subscription.push(sub);
  }

}
