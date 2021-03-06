import { Injectable, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';

import { Observable, of, Subject, BehaviorSubject, timer, zip, throwError } from 'rxjs';
import { catchError, map, tap, debounceTime, distinctUntilChanged, switchMap, share, finalize, retry } from 'rxjs/operators';

import { MockDataProviderService } from './mock-data-provider.service';
import { ERRORS_MESSAGES} from './../errors-messages';

@Injectable({
  providedIn: 'root'
})
export class MockLoadBarService {

  private requestAmount$ = new BehaviorSubject(0);
  public showLoadBar$ = this.requestAmount$.asObservable();

  requestStart() {
      this.requestAmount$.next(this.requestAmount$.getValue() + 1);
  }

  requestEnd() {
      this.requestAmount$.next(this.requestAmount$.getValue() - 1);
  }
}
@Injectable({
  providedIn: 'root'
})
export class MockHttpErrorService {

  private errorHandler$ = new BehaviorSubject(null);
  public showError$ = this.errorHandler$.asObservable();

  fetchError(errorResult: string) {
    this.errorHandler$.next(errorResult);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MockInterceptorService implements HttpInterceptor {

  private err_msg = ERRORS_MESSAGES;

  constructor(
    private mockLoadBarService: MockLoadBarService,
    private mockHttpErrorService: MockHttpErrorService,
    private mockDataProviderService: MockDataProviderService
    ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.mockLoadBarService.requestStart();
    return next.handle(req).pipe(
      retry(3),
      catchError((err) => {
        this.handleAuthError(err);
        return throwError(err);
      }),
      map(event => {
        return event;
      }),
      finalize(() => {
        this.mockLoadBarService.requestEnd();
      }),
    );
  }

  handleAuthError(err: any) {
    // this.dataProviderService.lang$.subscribe(lang => {
    //   if (this.err_msg.hasOwnProperty(err.status)) {
    //     this.httpErrorService.fetchError(this.err_msg[err.status][lang]);
    //   } else {
    //     this.httpErrorService.fetchError(this.err_msg['default'][lang]);
    //   }
    // });
  }
}
