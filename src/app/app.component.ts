import { Component, OnInit } from '@angular/core'; // modifié
import { MatDialog, MatDialogRef } from '@angular/material';
import {FocusMonitor} from '@angular/cdk/a11y';

import { Observable, of, Subject, BehaviorSubject, timer, zip, observable, Subscriber, Subscription } from 'rxjs';
import { catchError, map, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { ApiHandlerService } from './api-handler.service';
import { DataProviderService } from './data-provider.service';
import { InterceptorService, LoadBarService, HttpErrorService } from './interceptor.service';

import { MatSnackBar } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit { // modifié

  cookieObj: any = {}; // contient mon cookie // utiliser tout le cookie est il pertinant?
  userData: any = {};
  characterData: any = {}; // contient les donnée utilisateur characterId, charatere name etc
  accessTokenExpirationTimer: Subscription;
  private progressBar: HTMLElement;
  public languages: any = [
    {short: 'en-us', lang: 'english'},
    {short: 'fr', lang: 'français'},
    {short: 'de', lang: 'deutsh'},
    {short: 'ja', lang: '日本語'},
    {short: 'ru', lang: 'русский'},
    {short: 'zh', lang: '中文'}
  ];
  public lang: Observable<string>;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private dataProviderService: DataProviderService,
    private dialog: MatDialog,
    private loadBarService: LoadBarService,
    private httpErrorService: HttpErrorService,
    private interceptorService: InterceptorService,
    public matSnackBar: MatSnackBar,
    public translate: TranslateService
  ) { }

  ngOnInit() {
    this.parseCookie(document.cookie);

    this.lang = this.dataProviderService.lang$.pipe(
      map(x => x === 'en-us' ? 'en' : x)
    );
    this.translate.addLangs(['en-us', 'fr', 'de', 'ru', 'ja', 'zh']);
    this.translate.setDefaultLang('en-us');

    if (this.cookieObj.userLanguage) {
      this.translate.use(this.cookieObj.userLanguage);
      // this.dataProviderService.lang.next(this.cookieObj.userLanguage);
      this.dataProviderService.setLang(this.cookieObj.userLanguage);
    } else {
      this.translate.use('en-us');
    }

    this.progressBar = document.getElementById('progress-bar');
    this.loadBarService.showLoadBar$.subscribe(
      x => {
        if ( x > 0) {
          this.progressBar.style.display = 'block';
        } else {
          this.progressBar.style.display = 'none';
        }
      }
    );
    this.httpErrorService.showError$.subscribe(x => {
      if (x !== null) {
        this.matSnackBar.open(x, '', {
          panelClass: ['snackbartheme'],
          duration: 5000
        });
      }
    });

    if (this.cookieObj.hasOwnProperty('userData')) {
      this.getUserData(this.cookieObj.userData);
    }

    if (this.cookieObj.hasOwnProperty('mailPreference')) {
      const mailPreference = JSON.parse(decodeURIComponent(this.cookieObj.mailPreference));
      // this.dataProviderService.mailPreference.next(mailPreference);
      this.dataProviderService.setMailPreference(mailPreference);

    }
  }

  openDialog(): void {
    this.dialog.open(DialogAboutComponent, {
      width: '70vw',
      // height: '600px',
      panelClass: 'about-dialog-box',
    });
  }

  parseCookie(allCookie: string): void {
    // const allCookie: string = document.cookie;
    const cookieArray: string[] = allCookie.split('; ');
    const cookieArrayLength: number = cookieArray.length;
    let cookie: string[];
    for (let i = 0; i < cookieArrayLength; i++) {
      cookie = cookieArray[i].split('=');
      this.cookieObj[cookie[0]] = cookie[1];
    }
  }

  generateTimer(userData: any, currentTime: number): void {
    const timeDif = Math.ceil(currentTime - userData.timeCreation);
    const time = (userData.expires_in - timeDif) * 1000;
    this.accessTokenExpirationTimer = timer(time).subscribe(() => this.getRefreshToken(userData));
  }

  getUserData(cookieData: string): void {
    this.apiHandlerService.getUserData(cookieData).pipe(
      catchError( err => of(`error: ${err}`))
    ).subscribe(data => {
      if ((typeof data === 'object') && data.userData.hasOwnProperty('access_token')) {
        this.characterData = data.characterData;
        this.userData = data.userData;
        this.dataProviderService.setCharacterData(data.characterData);
        this.dataProviderService.setUserData(data.userData);
        const currentTime = new Date().getTime() / 1000;
        if (currentTime - data.userData.timeCreation > 0) {
          this.generateTimer(data.userData, currentTime);
        } else {
          this.getRefreshToken(data.userData);
        }
      } else {
        // ne contient pas l'access_token raise an error
        const err = {status: 626};
        this.interceptorService.handleAuthError(err);
      }
    });
  }

  getRefreshToken(userData: any): void {
    const currentTime: number = new Date().getTime() / 1000;
    this.apiHandlerService.getRefreshToken(userData.refresh_token).pipe(
      catchError( err => of(`error: ${err}`))
    ).subscribe(data => {
      this.userData = data;
      this.generateTimer(data, currentTime);
      this.dataProviderService.setUserData(data);
    });
  }

  disconnect(): void {
    document.cookie = 'userData=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    this.dataProviderService.setUserData(null);
    this.dataProviderService.setCharacterData(null);
    this.userData = {};
    this.cookieObj = {};
    this.characterData = {};
    this.accessTokenExpirationTimer.unsubscribe();
  }

  changeLang(lang): void {
    this.translate.use(lang.short);
    // this.dataProviderService.lang.next(lang.short);
    this.dataProviderService.setLang(lang.short);
    document.cookie = `userLanguage=${lang.short}; expires=Thu, 01 Jan 2050 00:00:01 GMT;path=/`;
  }
}

@Component({
  selector: 'app-dialog-about',
  templateUrl: './dialog-about.component.html',
  styleUrls: ['./dialog-about.component.css']
})
export class DialogAboutComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogAboutComponent>,
    private focusMonitor: FocusMonitor
  ) {}

  ngOnInit() {
    this.focusMonitor.stopMonitoring(document.getElementById('close-cross'));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
