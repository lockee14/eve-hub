import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core'; // my translation service for i18n
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeContentComponent } from './home-content.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

describe('HomeContentComponent', () => {
  let component: HomeContentComponent;
  let fixture: ComponentFixture<HomeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeContentComponent ],
      imports: [
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(HomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have <h1> with "welcome to eve-hub"', () => {
    const HomeElement: HTMLElement = fixture.nativeElement;
    const h1 = HomeElement.querySelector('h1');
    expect(h1.textContent).toEqual('welcome to eve-hub');
  });

  it('should have <h4> element', () => {
    const HomeElement: HTMLElement = fixture.nativeElement;
    const h4 = HomeElement.querySelector('h4');
    expect(h4).toBeTruthy();
  });
});
