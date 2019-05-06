import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { MaterialDesignModule } from './../../material-design.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'; // my translation service for i18n
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ContentComponent } from './content.component';
import { UniverseService } from './../../eve-angular-client/api/universe.service';
import { MarketService } from './../../eve-angular-client/api/market.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({selector: 'app-collapsible-component', template: ''})
class CollapsibleComponentComponent {
  @Input() marketGroup: any;
  @Input() region: number;
}

@Component({selector: 'app-chart', template: ''})
class ChartComponent {}

@Component({selector: 'app-buy', template: ''})
class BuyComponent {}

@Component({selector: 'app-sell', template: ''})
class SellComponent {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ContentComponent,
        CollapsibleComponentComponent,
        BuyComponent,
        SellComponent,
        ChartComponent
      ],
      providers: [
        UniverseService,
        MarketService
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialDesignModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
            { path: 'market',
            children: [
              { path: 'chart/:regionId/:itemId', component: ChartComponent},
              { path: 'buy/:regionId/:itemId', component: BuyComponent},
              { path: 'sell/:regionId/:itemId', component: SellComponent},
              { path: '**', redirectTo: '', pathMatch: 'full'}
            ]},
          ])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
