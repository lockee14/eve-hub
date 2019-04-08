import { TestBed, async } from '@angular/core/testing';
import { AppComponent, DialogAboutComponent } from './app.component';
import { MaterialDesignModule } from './material-design.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'; // my translation service for i18n
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiHandlerService } from './api-handler.service';
import { MockApiHandlerService } from './testing/mock-api-handler.service';
import { DataProviderService } from './data-provider.service';
import { MockDataProviderService } from './testing/mock-data-provider.service';
import { InterceptorService } from './interceptor.service';
import { MockInterceptorService } from './testing/mock-interceptor.service';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      providers: [
        {provide: ApiHandlerService, useClass: MockApiHandlerService},
        {provide: DataProviderService, useClass: MockDataProviderService},
        {provide: InterceptorService, useClass: MockInterceptorService},
      ],
      imports: [
        BrowserAnimationsModule,
        MaterialDesignModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('app.parseCookie() should parse and store cookie in app.cookieObj', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'parseCookie').and.callThrough();
    app.parseCookie('data=fakeData; ');
    expect(app.parseCookie).toHaveBeenCalled();
    expect(app.cookieObj['data']).toBe('fakeData');
  }));

  it('app.getUserData() should get and store userData', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const apiHandlerService = TestBed.get(ApiHandlerService);
    const interceptorService = TestBed.get(InterceptorService);
    spyOn(app, 'getUserData').and.callThrough();
    spyOn(apiHandlerService, 'getUserData').and.callThrough();
    spyOn(interceptorService, 'handleAuthError');
    spyOn(app, 'generateTimer');
    spyOn(app, 'getRefreshToken');

    app.getUserData('valid');
    expect(app.getUserData).toHaveBeenCalled();
    expect(apiHandlerService.getUserData).toHaveBeenCalled();
    expect(app.characterData.CharacterName).toBe('charaName');
    expect(app.userData.access_token).toBe('token');
    expect(app.generateTimer).toHaveBeenCalled();

    app.getUserData('validOutOfTime');
    expect(app.getRefreshToken).toHaveBeenCalled();

    app.getUserData('invalid');
    expect(interceptorService.handleAuthError).toHaveBeenCalled();

    app.getUserData('error');
    expect(interceptorService.handleAuthError).toHaveBeenCalled();
  }));

  it('app.getRefreshToken() should get a new token from the server', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const apiHandlerService = TestBed.get(ApiHandlerService);
    const dataProviderService = TestBed.get(DataProviderService);
    spyOn(app, 'getRefreshToken').and.callThrough();
    spyOn(app, 'generateTimer');
    spyOn(apiHandlerService, 'getRefreshToken').and.callThrough();
    spyOn(dataProviderService, 'setUserData');
    app.getRefreshToken({access_token: 'token', timeCreation: 0});
    expect(apiHandlerService.getRefreshToken).toHaveBeenCalled();
    expect(app.userData).toBeTruthy();
    expect(app.generateTimer).toHaveBeenCalled();
    expect(dataProviderService.setUserData).toHaveBeenCalled();
  }));

  it('app.parseCookie() should parse and store cookie in app.cookieObj', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'parseCookie').and.callThrough();
    app.parseCookie('data=fakeData; ');
    expect(app.parseCookie).toHaveBeenCalled();
    expect(app.cookieObj['data']).toBe('fakeData');
  }));

  it('should have a login image when app.characterData is null and a charactere image if not', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const appElement: HTMLElement = fixture.nativeElement;
    let log = appElement.querySelector('#log');
    const connectImg = log.querySelector('[alt="eve-online-connect"]');
    expect(connectImg).toBeTruthy();
    app.characterData = {CharacterID: 2113692300, CharacterName: 'charaName'};
    fixture.detectChanges();
    log = appElement.querySelector('#log');
    const charaImg = log.querySelector('[alt="eve-online-charactere"]');
    expect(charaImg).toBeTruthy();
  });

  it('changeLang() should change the language', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const dataProviderService = TestBed.get(DataProviderService);
    spyOn(app, 'changeLang').and.callThrough();
    spyOn(dataProviderService, 'setLang');
    app.changeLang('fr');
    expect(app.changeLang).toHaveBeenCalled();
    expect(dataProviderService.setLang).toHaveBeenCalled();
  }));
});
