import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MailContentComponent } from './mail-content/mail-content.component';
import { MailReaderComponent } from './mail-reader/mail-reader.component';
import { NewMailComponent } from './new-mail/new-mail.component';


const mailRoutes: Routes = [
  // { path: '', component: MailContentComponent },
  { path: 'mail',
    component: MailContentComponent,
    children: [
      { path: '', component: MailReaderComponent},
      { path: 'new', component: NewMailComponent},
      { path: '**', redirectTo: '', pathMatch: 'full'}
  ]},
  // { path: '**', redirectTo: '', pathMatch: 'full'} faire attention avec ce truc angular check chaque sous route,
  // le ** aka wildcard match tout
];


@NgModule({
  imports: [
    // CommonModule,
    RouterModule.forChild(mailRoutes) // { enableTracing: true } for debuging purpose
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class MailRoutingModule { }
