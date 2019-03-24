import { MarketRoutingModule } from './market-routing.module';

describe('MarketRoutingModule', () => {
  let marketRoutingModule: MarketRoutingModule;

  beforeEach(() => {
    marketRoutingModule = new MarketRoutingModule();
  });

  it('should create an instance', () => {
    expect(marketRoutingModule).toBeTruthy();
  });
});
