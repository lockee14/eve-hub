import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MailContentComponent } from './mail-content/mail-content.component';
import { MailRoutingModule } from './mail-routing.module';

import { MaterialDesignModule } from '../material-design.module';
import { NewMailComponent } from './new-mail/new-mail.component';
import { MailReaderComponent, DialogTemplateComponent } from './mail-reader/mail-reader.component';


@NgModule({
  imports: [
    CommonModule,
    MailRoutingModule,
    MaterialDesignModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    MailReaderComponent,
    DialogTemplateComponent
  ],
  declarations: [
    MailContentComponent,
    NewMailComponent,
    MailReaderComponent,
    DialogTemplateComponent
  ]
})
export class MailModule { }
