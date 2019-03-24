import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialDesignModule } from '../material-design.module';
import { AppraisalContentComponent } from './appraisal-content/appraisal-content.component';
import { AppraisalRoutingModule } from './appraisal-routing.module';
import { AppraisalResultComponent, DialogTemplateComponent } from './appraisal-result/appraisal-result.component';

@NgModule({
  imports: [
    CommonModule,
    AppraisalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialDesignModule
  ],
  entryComponents: [
    AppraisalResultComponent,
    DialogTemplateComponent
  ],
  declarations: [
    AppraisalContentComponent,
    AppraisalResultComponent,
    DialogTemplateComponent
  ]
})
export class AppraisalModule { }
