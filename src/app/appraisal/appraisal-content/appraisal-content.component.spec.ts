import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppraisalContentComponent } from './appraisal-content.component';

describe('AppraisalContentComponent', () => {
  let component: AppraisalContentComponent;
  let fixture: ComponentFixture<AppraisalContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppraisalContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppraisalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
