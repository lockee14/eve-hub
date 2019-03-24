import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent, DialogAboutComponent } from './app.component';

import { ApiModule } from './eve-angular-client/api.module';
import { AppRoutingModule } from './app-routing.module';
import { MailModule } from './mail/mail.module';
import { MarketModule } from './market/market.module';
import { HomeModule } from './home/home.module';
import { AppraisalModule } from './appraisal/appraisal.module';

import { InterceptorService } from './interceptor.service';
import { MaterialDesignModule } from './material-design.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DialogAboutComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialDesignModule,
    HttpClientModule,
    FormsModule,
    ApiModule,
    MailModule,
    MarketModule,
    HomeModule,
    AppraisalModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    AppComponent,
    DialogAboutComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
