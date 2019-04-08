import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppraisalService } from './appraisal.service';

describe('AppraisalService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AppraisalService],
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: AppraisalService = TestBed.get(AppraisalService);
    expect(service).toBeTruthy();
  });
});
