import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailReaderComponent } from './mail-reader.component';

describe('MailReaderComponent', () => {
  let component: MailReaderComponent;
  let fixture: ComponentFixture<MailReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailReaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
