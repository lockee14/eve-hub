import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MaterialDesignModule } from './../../material-design.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'; // my translation service for i18n
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppraisalContentComponent } from './appraisal-content.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@Component({selector: 'app-appraisal-result', template: ''})
class AppraisalResultComponent {}

import { convertToParamMap, ParamMap, Params, ActivatedRoute } from '@angular/router';
import { ReplaySubject, of } from 'rxjs';

export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private paramSubject = new ReplaySubject<ParamMap>();
  private firstChildStub = null;
  constructor(initialParams?: Params) {
    this.setParamMap(initialParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.paramSubject.asObservable();
  readonly firstChild = this.firstChildStub;
  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.paramSubject.next(convertToParamMap(params));
  }

  setFirstChild() {
    this.firstChildStub = new ActivatedRouteStub();
  }
}
class MockActivatedRoute {
  readonly firstChild = new ActivatedRouteStub();
}
describe('AppraisalContentComponent', () => {
  let component: AppraisalContentComponent;
  let fixture: ComponentFixture<AppraisalContentComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppraisalContentComponent,
        AppraisalResultComponent
      ],
      providers: [
        {provide: ActivatedRoute, useClass: MockActivatedRoute}
      ],
      imports: [
        MaterialDesignModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(
          [
            {path: '', component: AppraisalContentComponent},
            {path: ':hash', component: AppraisalContentComponent}
          ]
        ),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClientTestingModule]
          }
        }),
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
