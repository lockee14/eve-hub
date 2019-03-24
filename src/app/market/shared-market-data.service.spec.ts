import { TestBed, inject } from '@angular/core/testing';

import { SharedMarketDataService } from './shared-market-data.service';

describe('SharedMarketDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedMarketDataService]
    });
  });

  it('should be created', inject([SharedMarketDataService], (service: SharedMarketDataService) => {
    expect(service).toBeTruthy();
  }));
});
