import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/*
  à renommer, ce fichier sert à communiquer avec le server
*/
export class ApiHandlerService {

  // for ng serve and ng test only
  public marketGroupIDUrl = 'api/market/'; // "api/market/"
  public userDataUrl = 'api/charactereId/';
  public refreshTokenUrl = 'api/refreshToken/';
  public searchUrl = 'api/search/';
  public searchListUrl = 'api/searchItemsList/';
  public structureUrl = 'api/structure/';

  // for ng build:
  // private marketGroupIDUrl = 'market/';
  // private userDataUrl = 'charactereId/';
  // private refreshTokenUrl = 'refreshToken/';
  // private searchUrl = 'search/';
  // private searchListUrl = 'searchItemsList/';
  // private structureUrl = 'structure/';

  constructor(private http: HttpClient) { }

  postItemsList(data: any): Observable<any> {
    return this.http.request('POST', this.searchListUrl,  {
      body: data,
      reportProgress: true
    }).pipe(
      catchError(err => of(`error ${err}`))
    );

  }

  getItemsList(hash): Observable<any> {
    return this.http.get<any>(this.searchListUrl + hash);
  }

  search(term): Observable<any> {
    if (!term.trim()) {
      return of([]);
    } else {
      return this.http.get<any>(this.searchUrl + term);
    }
  }

  getMarketGroup(parentId): Observable<any> {
    if (parentId === undefined) {
      return this.http.get<any>(this.marketGroupIDUrl + 'null');
    } else {
      return this.http.get<any>(this.marketGroupIDUrl + parentId);
    }
  }

  getUserData(access_token): Observable<any> {
    return this.http.get<any>(this.userDataUrl + access_token);
  }

  getStructureData(structureId): Observable<any> {
    return this.http.get<any>(this.structureUrl + structureId);
  }

  getRefreshToken(refresh_token): Observable<any> {
    return this.http.get<any>(this.refreshTokenUrl + refresh_token);
  }
}
