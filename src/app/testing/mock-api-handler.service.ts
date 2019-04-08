import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MockApiHandlerService {

  // for ng serve only
  private marketGroupIDUrl = 'api/market/'; // "api/market/"
  private userDataUrl = 'api/charactereId/';
  private refreshTokenUrl = 'api/refreshToken/';
  private searchUrl = 'api/search/';
  private searchListUrl = 'api/searchItemsList/';
  private structureUrl = 'api/structure/';

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

//   getUserData(access_token): Observable<any> {
//     return this.http.get<any>(this.userDataUrl + access_token);
//   }
  getUserData(result: string): Observable<any> {
    switch(result) {
      case 'valid':
        return of({
          characterData: {CharacterID: 2113692300, CharacterName: 'charaName'},
          userData: {access_token: 'token', timeCreation: 0}
        });
      case 'validOutOfTime':
        return of({
          characterData: {CharacterID: 2113692300, CharacterName: 'charaName'},
          userData: {access_token: 'token', timeCreation: new Date().getTime()}
        });
      case 'invalid':
        return of({characterData: {}, userData: {}})
      case 'error':
        return throwError('error')
    }
  }

  getStructureData(structureId): Observable<any> {
    return this.http.get<any>(this.structureUrl + structureId);
  }

  getRefreshToken(refresh_token): Observable<any> {
    return of({
      characterData: {CharacterID: 2113692300, CharacterName: 'charaName'},
      userData: {access_token: 'token', timeCreation: 0}
    });
    // return this.http.get<any>(this.refreshTokenUrl + refresh_token);
  }
}
