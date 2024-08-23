import { Test, TestingModule } from '@nestjs/testing';
import { ReportSpamController } from './report-spam.controller';
import { ReportSpamService } from './report-spam.service';

describe('ReportSpamController', () => {
  let controller: ReportSpamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportSpamController],
      providers: [ReportSpamService],
    }).compile();

    controller = module.get<ReportSpamController>(ReportSpamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
