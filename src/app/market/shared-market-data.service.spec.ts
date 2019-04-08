import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UniverseService } from './../eve-angular-client/api/universe.service';
import { SharedMarketDataService } from './shared-market-data.service';
import { ApiHandlerService } from '../api-handler.service';
import { MockApiHandlerService } from '../testing/mock-api-handler.service';
import { DataProviderService } from '../data-provider.service';
import { MockDataProviderService } from '../testing/mock-data-provider.service';

describe('SharedMarketDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SharedMarketDataService,
        UniverseService,
        { provide: DataProviderService, useClass: MockDataProviderService },
        { provide: ApiHandlerService, useClass: MockApiHandlerService }
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should be created', inject([SharedMarketDataService], (service: SharedMarketDataService) => {
    expect(service).toBeTruthy();
  }));

  it('setChildParams() should change the ChildParams', (done: DoneFn) => {
    const service: SharedMarketDataService = TestBed.get(SharedMarketDataService);
    spyOn(service, 'setChildParams').and.callThrough();
    service.setChildParams('test');
    expect(service.setChildParams).toHaveBeenCalled();
    service.childParams$.subscribe(data => {
      expect(data).toBe('test');
      done();
    });
  });

  it('setMarketHistory() should change the MarketHistory', (done: DoneFn) => {
    const service: SharedMarketDataService = TestBed.get(SharedMarketDataService);
    spyOn(service, 'setMarketHistory').and.callThrough();
    service.setMarketHistory('test');
    expect(service.setMarketHistory).toHaveBeenCalled();
    service.marketHistory$.subscribe(data => {
      expect(data).toBe('test');
      done();
    });
  });

  it('setSelectedView() should change the SelectedView', (done: DoneFn) => {
    const service: SharedMarketDataService = TestBed.get(SharedMarketDataService);
    spyOn(service, 'setSelectedView').and.callThrough();
    service.setSelectedView('test');
    expect(service.setSelectedView).toHaveBeenCalled();
    service.selectedView$.subscribe(data => {
      expect(data).toBe('test');
      done();
    });
  });

  // it('setMarketOrders() should change the MarketOrders', (done: DoneFn) => { // compliqué à teste car grosse fontion
  //   const service: SharedMarketDataService = TestBed.get(SharedMarketDataService);
  //   spyOn(service, 'setMarketOrders').and.callThrough();
  //   spyOn(service, 'refactorOrderData').and.callThrough();
  //   service.setMarketOrders('fr');
  //   expect(service.setMarketOrders).toHaveBeenCalled();
  //   expect(service.refactorDataDate).toHaveBeenCalled();
  // });
});
