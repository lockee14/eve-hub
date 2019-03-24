import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { MaterialDesignModule } from '../material-design.module';
import { HomeContentComponent } from './home-content/home-content.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialDesignModule
  ],
  declarations: [HomeContentComponent]
})
export class HomeModule { }
