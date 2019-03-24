import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContentComponent } from './content/content.component';
import { ChartComponent } from './chart/chart.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';

const marketRoutes: Routes = [
  { path: 'market',
  component: ContentComponent,
  children: [
    { path: 'chart/:regionId/:itemId', component: ChartComponent},
    { path: 'buy/:regionId/:itemId', component: BuyComponent},
    { path: 'sell/:regionId/:itemId', component: SellComponent},
    { path: '**', redirectTo: '', pathMatch: 'full'}
  ]},
];


@NgModule({
  imports: [
    RouterModule.forChild(marketRoutes)
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class MarketRoutingModule { }
