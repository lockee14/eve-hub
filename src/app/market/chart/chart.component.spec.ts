import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component } from '@angular/core';
import { UniverseService } from './../../eve-angular-client/api/universe.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ChartComponent } from './chart.component';

// @Component({selector: 'app-content', template: ''})
// class ContentComponent {}

// @Component({selector: 'app-buy', template: ''})
// class BuyComponent {}

// @Component({selector: 'app-sell', template: ''})
// class SellComponent {}

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartComponent ],
      providers: [
        UniverseService,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule //.withRoutes([
        //   { path: 'market',
        //   component: ContentComponent,
        //   children: [
        //     { path: 'chart/:regionId/:itemId', component: ChartComponent},
        //     { path: 'buy/:regionId/:itemId', component: BuyComponent},
        //     { path: 'sell/:regionId/:itemId', component: SellComponent},
        //     { path: '**', redirectTo: '', pathMatch: 'full'}
        //   ]},
        // ])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
