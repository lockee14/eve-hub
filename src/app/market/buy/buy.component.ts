import { Component, OnInit, ViewChild, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Scroll } from '@angular/router';

import { MatPaginator, MatSort, MatTableDataSource, MatPaginatorIntl } from '@angular/material';

import { Observable, Subscription } from 'rxjs';

import { SharedMarketDataService } from '../shared-market-data.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  public marketBuyOrders: MatTableDataSource<any> = new MatTableDataSource();
  private parametres$: Observable<any>;
  // public isTrue: boolean = false; // à quoi ça sert?
  private dataLength: number;
  private page = 30;
  public columnsToDisplay: string[] = ['volume', 'price', 'location', 'expire', 'received'];
  @ViewChild(MatSort) sort: MatSort;
  paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), this.ref);

  constructor(
    private route: ActivatedRoute,
    private sharedMarketDataService: SharedMarketDataService,
    private ref: ChangeDetectorRef
  ) {}

  @HostListener('window:scroll', ['$event'])
  onscroll(event) {
    const elem = event.currentTarget;
    if ((elem.innerHeight + elem.pageYOffset + 200) >= document.body.offsetHeight && this.page <= this.dataLength) {
      this.page += 30;
      this.paginator._changePageSize(this.page);
    }
  }

  ngOnInit() {
    this.parametres$ = this.route.params;
    const sub = this.parametres$.subscribe(params => this.sharedMarketDataService.setChildParams(params));
    this.subscription.push(sub);
    this.sharedMarketDataService.setSelectedView('buy');
    this.paginator.pageSize = this.page;
    this.paginator.ngOnInit();
    this.marketBuyOrders.paginator = this.paginator;
    this.marketBuyOrders.sort = this.sort;
    this.fetchData();
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }

  fetchData(): void {
    const sub = this.sharedMarketDataService.marketBuyOrders$.subscribe(data => {
      // this.isTrue = true;
      if (data !== null) {
        this.dataLength = data.length;
        this.marketBuyOrders.data = data;
      }
    });
    this.subscription.push(sub);
  }
}
