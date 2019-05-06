import { Component, OnInit, ViewChild, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { MatPaginator, MatSort, MatTableDataSource, MatPaginatorIntl} from '@angular/material';

import { Observable, Subscription } from 'rxjs';

import { SharedMarketDataService } from '../shared-market-data.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit, OnDestroy {

  private subscription: Subscription[] = [];
  public marketSellOrders: MatTableDataSource<any> = new MatTableDataSource();
  private parametres$: Observable<any>;
  // public isTrue: boolean = false;
  private dataLength: number;
  private page = 30;
  public columnsToDisplay: string[] = ['volume', 'price', 'location', 'expire', 'received'];
  @ViewChild(MatSort) sort: MatSort;
  paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), this.ref);
  constructor(
    private route: ActivatedRoute,
    private sharedMarketDataService: SharedMarketDataService,
    private ref: ChangeDetectorRef
  ) { }

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
    this.sharedMarketDataService.setSelectedView('sell');
    this.paginator.pageSize = this.page;
    this.paginator.ngOnInit();
    this.marketSellOrders.paginator = this.paginator;
    this.marketSellOrders.sort = this.sort;
    this.fetchData();
  }

  ngOnDestroy() {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }

  fetchData(): void {
    const sub = this.sharedMarketDataService.marketSellOrders$.subscribe(data => {
      // this.isTrue = true;
      if (data !== null) {
        this.dataLength = data.length;
        this.marketSellOrders.data = data;
      }
    });
    this.subscription.push(sub);
  }
}
