import { Test, TestingModule } from '@nestjs/testing';
import { ReportSpamService } from './report-spam.service';

describe('ReportSpamService', () => {
  let service: ReportSpamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReportSpamService],
    }).compile();

    service = module.get<ReportSpamService>(ReportSpamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
