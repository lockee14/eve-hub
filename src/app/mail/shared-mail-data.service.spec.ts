import { TestBed, inject } from '@angular/core/testing';

import { SharedMailDataService } from './shared-mail-data.service';

describe('SharedMailDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedMailDataService]
    });
  });

  it('should be created', inject([SharedMailDataService], (service: SharedMailDataService) => {
    expect(service).toBeTruthy();
  }));
});
