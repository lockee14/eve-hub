import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialDesignModule } from './../../material-design.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'; // my translation service for i18n
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppraisalResultComponent } from './appraisal-result.component';
import { AppraisalService } from './../appraisal.service';
import { MarketService } from '../../eve-angular-client/api/market.service';
import { UniverseService } from '../../eve-angular-client/api/universe.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

describe('AppraisalResultComponent', () => {
  let component: AppraisalResultComponent;
  let fixture: ComponentFixture<AppraisalResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppraisalResultComponent,
      ],
      providers: [
        AppraisalService,
        MarketService,
        UniverseService
      ],
      imports: [
        MaterialDesignModule,
        HttpClientTestingModule,
        RouterTestingModule,
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
    fixture = TestBed.createComponent(AppraisalResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
