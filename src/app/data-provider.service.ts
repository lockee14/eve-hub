import { Injectable } from '@angular/core';

import { Observable, of, Subject, BehaviorSubject, zip } from 'rxjs';
import { catchError, map, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  public lang = new BehaviorSubject<any>('en-us');
  public mailPreference = new BehaviorSubject<any>(null);
  public lang$ = this.lang.asObservable();
  public mailPreference$ = this.mailPreference.asObservable();
  
  private userData = new BehaviorSubject<any>(null);
  private characterData = new BehaviorSubject<any>(null);
  public userData$ = this.userData.asObservable();
  public characterData$ = this.characterData.asObservable();

  constructor() {}

  setUserData(data: any): void {
    this.userData.next(data);
  }

  setCharacterData(data: any): void {
    this.characterData.next(data);
  }

  setLang(lang: string): void {
    this.lang.next(lang);
  }

  setMailPreference(data: any): void {
    this.mailPreference.next(data);
  }
}
