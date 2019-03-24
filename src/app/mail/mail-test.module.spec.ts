import { MailTestModule } from './mail-test.module';

describe('MailTestModule', () => {
  let mailTestModule: MailTestModule;

  beforeEach(() => {
    mailTestModule = new MailTestModule();
  });

  it('should create an instance', () => {
    expect(mailTestModule).toBeTruthy();
  });
});
