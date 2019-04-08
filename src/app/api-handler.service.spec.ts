import { TestBed, inject } from '@angular/core/testing';

import { ApiHandlerService } from './api-handler.service';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiHandlerService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiHandlerService],
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', inject([ApiHandlerService], (service: ApiHandlerService) => {
    expect(service).toBeTruthy();
  }));

  it('postItemsList() post an item list to the server', (done: DoneFn) => {
    const service: ApiHandlerService = TestBed.get(ApiHandlerService);
    const itemList = 'itemList';
    const testString = 'testString';
    spyOn(service, 'postItemsList').and.callThrough();
    service.postItemsList(itemList).subscribe(data => {
      expect(data).toEqual(testString);
      done();
    });
    expect(service.postItemsList).toHaveBeenCalled();
    const req = httpTestingController.expectOne(service.searchListUrl);
    expect(req.request.method).toEqual('POST');
    req.flush(testString);
  });

  it('getItemsList() should get an item list from the server', (done: DoneFn) => {
    const service: ApiHandlerService = TestBed.get(ApiHandlerService);
    const itemList = 'itemList';
    const testString = 'testString';
    spyOn(service, 'getItemsList').and.callThrough();
    service.getItemsList(testString).subscribe(data => {
      expect(data).toEqual(itemList);
      done();
    });
    expect(service.getItemsList).toHaveBeenCalled();
    const req = httpTestingController.expectOne(service.searchListUrl + testString);
    expect(req.request.method).toEqual('GET');
    req.flush(itemList);
  });

  it('search() should search for term from the server', (done: DoneFn) => {
    const service: ApiHandlerService = TestBed.get(ApiHandlerService);
    const searchTerm = 'searchTerm';
    const testString = 'testString';
    spyOn(service, 'search').and.callThrough();
    service.search(searchTerm).subscribe(data => {
      expect(data).toEqual(testString);
      done();
    });
    expect(service.search).toHaveBeenCalled();
    const req = httpTestingController.expectOne(service.searchUrl + searchTerm);
    expect(req.request.method).toEqual('GET');
    req.flush(testString);
  });

  it('getMarketGroup() should get market groupe from the server', (done: DoneFn) => {
    const service: ApiHandlerService = TestBed.get(ApiHandlerService);
    const marketGroup: number[] = [1, 2, 3, 4];
    spyOn(service, 'getMarketGroup').and.callThrough();
    service.getMarketGroup(undefined).subscribe(data => {
      expect(data).toEqual(marketGroup);
      done();
    });
    expect(service.getMarketGroup).toHaveBeenCalled();
    const req = httpTestingController.expectOne(service.marketGroupIDUrl + 'null');
    expect(req.request.method).toEqual('GET');
    req.flush(marketGroup);
  });

  it('getUserData() should get user data from the server', (done: DoneFn) => {
    const service: ApiHandlerService = TestBed.get(ApiHandlerService);
    const access_token: string = 'token';
    const userData: any = {
      characterData: {CharacterID: 2113692300, CharacterName: 'charaName'},
      userData: {access_token: 'token', timeCreation: 0}
    };
    spyOn(service, 'getUserData').and.callThrough();
    service.getUserData(access_token).subscribe(data => {
      expect(data).toEqual(userData);
      done();
    });
    expect(service.getUserData).toHaveBeenCalled();
    const req = httpTestingController.expectOne(service.userDataUrl + access_token);
    expect(req.request.method).toEqual('GET');
    req.flush(userData);
  });

  it('getStructureData() should get structure data from the server', (done: DoneFn) => {
    const service: ApiHandlerService = TestBed.get(ApiHandlerService);
    const structureId: string = '12345';
    const structure: any = {
      name: 'structure',
      location: 'somewhere'
    };
    spyOn(service, 'getStructureData').and.callThrough();
    service.getStructureData(structureId).subscribe(data => {
      expect(data).toEqual(structure);
      done();
    });
    expect(service.getStructureData).toHaveBeenCalled();
    const req = httpTestingController.expectOne(service.structureUrl + structureId);
    expect(req.request.method).toEqual('GET');
    req.flush(structure);
  });

  it('getRefreshToken() should get a new access_token from the server', (done: DoneFn) => {
    const service: ApiHandlerService = TestBed.get(ApiHandlerService);
    const refresh_token: string = 'refresh_token';
    const newToken: string = 'new_token';
    spyOn(service, 'getRefreshToken').and.callThrough();
    service.getRefreshToken(refresh_token).subscribe(data => {
      expect(data).toEqual(newToken);
      done();
    });
    expect(service.getRefreshToken).toHaveBeenCalled();
    const req = httpTestingController.expectOne(service.refreshTokenUrl + refresh_token);
    expect(req.request.method).toEqual('GET');
    req.flush(newToken);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

});
