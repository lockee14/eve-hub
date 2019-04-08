import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MaterialDesignModule } from './../../material-design.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'; // my translation service for i18n
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MailContentComponent } from './mail-content.component';
import { SharedMailDataService } from './../shared-mail-data.service';
import { MailService } from './../../eve-angular-client/api/mail.service';
import { CharacterService } from './../../eve-angular-client/api/character.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@Component({selector: 'app-mail-reader', template: ''})
class MailReaderComponent {}

@Component({selector: 'app-new-mail', template: ''})
class NewMailComponent {}

describe('MailContentComponent', () => {
  let component: MailContentComponent;
  let fixture: ComponentFixture<MailContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MailContentComponent,
        MailReaderComponent,
        NewMailComponent
      ],
      providers: [
        SharedMailDataService,
        MailService,
        CharacterService
      ],
      imports: [
        HttpClientTestingModule,
        MaterialDesignModule,
        RouterTestingModule.withRoutes(
          [
            { path: 'mail',
              component: MailContentComponent,
              children: [
                { path: '', component: MailReaderComponent},
                { path: 'new', component: NewMailComponent},
                { path: '**', redirectTo: '', pathMatch: 'full'}
              ]},
          ]
        ),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClientTestingModule]
          }
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
