import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UniverseService } from './../../eve-angular-client/api/universe.service';
import { CollapsibleComponentComponent } from './collapsible-component.component';
import { componentRefresh } from '@angular/core/src/render3/instructions';

describe('CollapsibleComponentComponent', () => {
  let component: CollapsibleComponentComponent;
  let fixture: ComponentFixture<CollapsibleComponentComponent>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollapsibleComponentComponent ],
      providers: [
        UniverseService
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollapsibleComponentComponent);
    component = fixture.componentInstance;
    component.marketGroup = {name: 'itemName'};
    component.region = 10000002;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
