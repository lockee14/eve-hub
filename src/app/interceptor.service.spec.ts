import { TestBed, inject } from '@angular/core/testing';
import { InterceptorService, LoadBarService, HttpErrorService } from './interceptor.service';
import { HttpClientModule, HttpEvent, HttpInterceptor, HttpClient, HTTP_INTERCEPTORS, HttpHandler} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MockDataProviderService } from './testing/mock-data-provider.service';
import { DataProviderService } from './data-provider.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


describe('LoadBarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadBarService = TestBed.get(LoadBarService);
    expect(service).toBeTruthy();
  });

  it('#showLoadBar$ should return 0', (done: DoneFn) => {
    const service: LoadBarService = TestBed.get(LoadBarService);
    service.showLoadBar$.subscribe(value => {
      expect(value).toBe(0);
      done();
    });
  });

  it('requestStart() should increment #showLoadBar$ by 1', (done: DoneFn) => {
    const service: LoadBarService = TestBed.get(LoadBarService);
    service.requestStart();
    service.showLoadBar$.subscribe(value => {
      expect(value).toBe(1);
      done();
    });
  });

  it('requestEnd() should decrement #showLoadBar$ by 1', (done: DoneFn) => {
    const service: LoadBarService = TestBed.get(LoadBarService);
    service.requestEnd();
    service.showLoadBar$.subscribe(value => {
      expect(value).toBe(-1);
      done();
    });
  });

});

describe('HttpErrorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpErrorService = TestBed.get(HttpErrorService);
    expect(service).toBeTruthy();
  });

  it('fetchError() should fetch new error message', (done: DoneFn) => {
    const service: HttpErrorService = TestBed.get(HttpErrorService);
    service.fetchError('error message');
    service.showError$.subscribe(value => {
      expect(value).toBe('error message');
      done();
    });
  });

});

describe('InterceptorService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {TestBed.configureTestingModule({
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
      LoadBarService,
      HttpErrorService,
      { provide: DataProviderService, useClass: MockDataProviderService }
    ],
    imports: [
      HttpClientTestingModule,
    ]
  });
  httpClient = TestBed.get(HttpClient);
  httpTestingController = TestBed.get(HttpTestingController);
});

  it('should be created', () => {
    const service: InterceptorService = TestBed.get(InterceptorService);
    expect(service).toBeTruthy();
  });

  it('intercept() should intercept http request and update LoadBarService state', (done: DoneFn) => {
    const loadBarService: LoadBarService = TestBed.get(LoadBarService);
    spyOn(loadBarService, 'requestStart').and.callThrough();
    spyOn(loadBarService, 'requestEnd').and.callThrough();

    const waitUntilCompletion = async() => {
      await httpClient.get('/data').toPromise();
    };
    waitUntilCompletion().then(() => {
      expect(loadBarService.requestEnd).toHaveBeenCalled();
      done();
    });
    expect(loadBarService.requestStart).toHaveBeenCalled();
    const req = httpTestingController.expectOne('/data');
    expect(req.request.method).toEqual('GET');
    req.flush('response');
  });

  it('intercept() should intercept error and call httpErrorService', (done: DoneFn) => {
    const httpErrorService: HttpErrorService = TestBed.get(HttpErrorService);
    spyOn(httpErrorService, 'fetchError').and.callThrough();
    httpClient.get('/data').pipe(catchError((data) => of(data))).subscribe(() => {
      expect(httpErrorService.fetchError).toHaveBeenCalled();
      done();
    });
    for (let i = 0; i < 4; i++) {
      const req = httpTestingController.expectOne('/data');
      expect(req.request.method).toEqual('GET');
      req.flush('error message', { status: 404, statusText: 'Error' });
    }
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

});

