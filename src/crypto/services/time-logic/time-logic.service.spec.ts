import { Test, TestingModule } from '@nestjs/testing';
import { TimeLogicService } from './time-logic.service';

describe('TimeLogicService', () => {
  let service: TimeLogicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeLogicService],
    }).compile();

    service = module.get<TimeLogicService>(TimeLogicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
