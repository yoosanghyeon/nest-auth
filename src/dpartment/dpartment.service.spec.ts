import { Test, TestingModule } from '@nestjs/testing';
import { DpartmentService } from './dpartment.service';

describe('DpartmentService', () => {
  let service: DpartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DpartmentService],
    }).compile();

    service = module.get<DpartmentService>(DpartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
