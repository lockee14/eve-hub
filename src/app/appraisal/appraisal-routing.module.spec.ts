import { AppraisalRoutingModule } from './appraisal-routing.module';

describe('AppraisalRoutingModule', () => {
  let appraisalRoutingModule: AppraisalRoutingModule;

  beforeEach(() => {
    appraisalRoutingModule = new AppraisalRoutingModule();
  });

  it('should create an instance', () => {
    expect(appraisalRoutingModule).toBeTruthy();
  });
});
