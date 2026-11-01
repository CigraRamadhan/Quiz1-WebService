import { Test, TestingModule } from '@nestjs/testing';
import { LapanganService } from './lapangan.service';

describe('LapanganService', () => {
  let service: LapanganService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LapanganService],
    }).compile();

    service = module.get<LapanganService>(LapanganService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
