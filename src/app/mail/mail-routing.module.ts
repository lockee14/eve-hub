import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MailContentComponent } from './mail-content/mail-content.component';
import { MailReaderComponent } from './mail-reader/mail-reader.component';
import { NewMailComponent } from './new-mail/new-mail.component';


const mailRoutes: Routes = [
  { path: 'mail',
    component: MailContentComponent,
    children: [
      { path: '', component: MailReaderComponent},
      { path: 'new', component: NewMailComponent},
      { path: '**', redirectTo: '', pathMatch: 'full'}
  ]},
];


@NgModule({
  imports: [
    RouterModule.forChild(mailRoutes)
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class MailRoutingModule { }
