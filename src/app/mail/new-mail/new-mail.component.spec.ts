import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialDesignModule } from './../../material-design.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'; // my translation service for i18n
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewMailComponent } from './new-mail.component';
import { MailService } from './../../eve-angular-client/api/mail.service';
import { CharacterService } from './../../eve-angular-client/api/character.service';
import { SearchService } from './../../eve-angular-client/api/search.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

declare var sceditor: any;

describe('NewMailComponent', () => {
  let component: NewMailComponent;
  let fixture: ComponentFixture<NewMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMailComponent ],
      providers: [
        MailService,
        CharacterService,
        SearchService
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientTestingModule,
        MaterialDesignModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
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
    fixture = TestBed.createComponent(NewMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
