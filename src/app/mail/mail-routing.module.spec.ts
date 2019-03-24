import { MailRoutingModule } from './mail-routing.module';

describe('MailRoutingModule', () => {
  let mailRoutingModule: MailRoutingModule;

  beforeEach(() => {
    mailRoutingModule = new MailRoutingModule();
  });

  it('should create an instance', () => {
    expect(mailRoutingModule).toBeTruthy();
  });
});
