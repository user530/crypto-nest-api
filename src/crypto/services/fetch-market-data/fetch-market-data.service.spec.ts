import { Test, TestingModule } from '@nestjs/testing';
import { FetchMarketDataService } from './fetch-market-data.service';

describe('FetchMarketDataService', () => {
  let service: FetchMarketDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FetchMarketDataService],
    }).compile();

    service = module.get<FetchMarketDataService>(FetchMarketDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
