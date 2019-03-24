import { Injectable } from '@angular/core';

import { Observable, of, Subject, BehaviorSubject, zip } from 'rxjs';
import { catchError, map, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  public lang = new BehaviorSubject<any>('en-us');
  private userData = new BehaviorSubject<any>(null);
  private characterData = new BehaviorSubject<any>(null);
  public mailPreference = new BehaviorSubject<any>(null);
  public lang$ = this.lang.asObservable();
  public userData$ = this.userData.asObservable();
  public characterData$ = this.characterData.asObservable();
  public mailPreference$ = this.mailPreference.asObservable();

  constructor() {}

  setUserData(data: any): void {
    this.userData.next(data);
  }

  setCharacterData(data: any): void {
    this.characterData.next(data);
  }
}
