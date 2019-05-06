import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OverlayModule } from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';

import { ContentComponent, DialogInfoComponent } from './content/content.component';
import { CollapsibleComponentComponent } from './collapsible-component/collapsible-component.component';
import { MarketRoutingModule } from './market-routing.module';

import { MaterialDesignModule } from '../material-design.module';
import { ChartComponent } from './chart/chart.component';
import { BuyComponent } from './buy/buy.component';
import { SellComponent } from './sell/sell.component';

@NgModule({
  imports: [
    CommonModule,
    MarketRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    PortalModule,
    MaterialDesignModule
  ],
  declarations: [
    ContentComponent,
    DialogInfoComponent,
    CollapsibleComponentComponent,
    ChartComponent,
    BuyComponent,
    SellComponent
  ],
  entryComponents: [
    DialogInfoComponent
  ]
})
export class MarketModule { }
