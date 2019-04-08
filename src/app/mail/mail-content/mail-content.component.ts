import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Observable, Subscription, of, Subject, BehaviorSubject, timer, zip, from, forkJoin} from 'rxjs';
import { tap } from 'rxjs/operators';

import { SharedMailDataService } from './../shared-mail-data.service';

@Component({
  selector: 'app-mail-content',
  templateUrl: './mail-content.component.html',
  styleUrls: ['./mail-content.component.css']
})

export class MailContentComponent implements OnInit, OnDestroy {

  public isLogged$: Observable<any>;
  private labels$: Observable<any>;

  private refreshTimer: boolean = true;
  private subscriptions: Subscription[] = [];

  public badgeColor: any = {};

  constructor(
    private sharedMailDataService: SharedMailDataService,
    private route: ActivatedRoute, // >> get paramMap method return un observable de urlparametre
    private router: Router,
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  getMailHeader() {
    this.sharedMailDataService.getLabels();
    this.labels$ = this.sharedMailDataService.labels.asObservable().pipe(
      tap(label => {
        for (const lab in label) {
          this.badgeColor[label[lab]['name']] = (label[lab].hasOwnProperty('unread_count') && label[lab].unread_count > 0) ? 'accent' : 'primary';

        }
      })
    );
  }

  setHeaders(label) {
    this.sharedMailDataService.setHeaders(label);
  }

  refresh() { // inclure un truc pour diminué le taux de rafraichissement, toutes les 30sec ou minute
    if (this.refreshTimer) {
      this.refreshTimer = false;
      this.getMailHeader();
      const time = timer(30000).subscribe(x => {
        this.refreshTimer = true;
        time.unsubscribe();
      });
    }
  }

  fetchData(): void {
    const sub = this.sharedMailDataService.userData$.subscribe( data => {
      if (data[0] !== null && data[1] !== null) {
        this.getMailHeader();
        this.isLogged$ = Observable.create(function(observer) {
          observer.next(true);
        });
      }
    });
    this.subscriptions.push(sub);
  }
}
