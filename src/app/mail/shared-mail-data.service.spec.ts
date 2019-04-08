import { TestBed, inject } from '@angular/core/testing';
import { MailService } from './../eve-angular-client/api/mail.service';
import { CharacterService } from './../eve-angular-client/api/character.service';
import { SharedMailDataService } from './shared-mail-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SharedMailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SharedMailDataService,
        CharacterService,
        MailService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', inject([SharedMailDataService], (service: SharedMailDataService) => {
    expect(service).toBeTruthy();
  }));
});
