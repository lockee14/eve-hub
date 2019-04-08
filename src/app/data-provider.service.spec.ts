import { TestBed, inject, async } from '@angular/core/testing';

import { DataProviderService } from './data-provider.service';

describe('DataProviderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataProviderService]
    });
  });

  it('should be created', inject([DataProviderService], (service: DataProviderService) => {
    expect(service).toBeTruthy();
  }));

  it('setUserData() should change the userData', (done: DoneFn) => {
    const service: DataProviderService = TestBed.get(DataProviderService);
    spyOn(service, 'setUserData').and.callThrough();
    service.setUserData({access_token: 'token', timeCreation: 0});
    expect(service.setUserData).toHaveBeenCalled();
    service.userData$.subscribe(data => {
      expect(data.access_token).toBe('token');
      done();
    });
  });

  it('setCharacterData() should change the userData', (done: DoneFn) => {
    const service: DataProviderService = TestBed.get(DataProviderService);
    spyOn(service, 'setCharacterData').and.callThrough();
    service.setCharacterData({CharacterID: 2113692300, CharacterName: 'charaName'});
    expect(service.setCharacterData).toHaveBeenCalled();
    service.characterData$.subscribe(data => {
      expect(data.CharacterName).toBe('charaName');
      done();
    });
  });

  it('setLang() should change the userData', (done: DoneFn) => {
    const service: DataProviderService = TestBed.get(DataProviderService);
    spyOn(service, 'setLang').and.callThrough();
    service.setLang('fr');
    expect(service.setLang).toHaveBeenCalled();
    service.lang$.subscribe(lang => {
      expect(lang).toBe('fr');
      done();
    });
  });

  it('setMailPreference() should change the userData', (done: DoneFn) => {
    const service: DataProviderService = TestBed.get(DataProviderService);
    spyOn(service, 'setMailPreference').and.callThrough();
    service.setMailPreference({showWarning: true});
    expect(service.setMailPreference).toHaveBeenCalled();
    service.mailPreference$.subscribe(data => {
      expect(data.showWarning).toBe(true);
      done();
    });
  });
});
