import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialDesignModule } from './../../material-design.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'; // my translation service for i18n
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedMailDataService } from './../shared-mail-data.service';
import { DataProviderService } from './../../data-provider.service';
import { MailReaderComponent } from './mail-reader.component';
import { MailService } from './../../eve-angular-client/api/mail.service';
import { CharacterService } from './../../eve-angular-client/api/character.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

describe('MailReaderComponent', () => {
  let component: MailReaderComponent;
  let fixture: ComponentFixture<MailReaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailReaderComponent ],
      providers: [
        DataProviderService,
        SharedMailDataService,
        MailService,
        CharacterService
      ],
      imports: [
        HttpClientTestingModule,
        MaterialDesignModule,
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
    fixture = TestBed.createComponent(MailReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
