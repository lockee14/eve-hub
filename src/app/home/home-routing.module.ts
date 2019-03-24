import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeContentComponent } from './home-content/home-content.component';

const marketRoutes: Routes = [
  { path: '', component: HomeContentComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(marketRoutes)
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class HomeRoutingModule { }
