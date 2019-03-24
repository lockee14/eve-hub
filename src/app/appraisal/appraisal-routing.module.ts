import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalContentComponent } from './appraisal-content/appraisal-content.component';

const appraisalRoutes: Routes = [
  { path: 'appraisal',
    component: AppraisalContentComponent,
    children: [
      { path: ':hash', component: AppraisalContentComponent},
      { path: '**', redirectTo: '', pathMatch: 'full'}
    ]},
];


@NgModule({
  imports: [
    RouterModule.forChild(appraisalRoutes)
  ],
  declarations: [],
  exports: [ RouterModule]
})
export class AppraisalRoutingModule { }
