import { Test, TestingModule } from '@nestjs/testing';
import { DpartmentController } from './dpartment.controller';

describe('DpartmentController', () => {
  let controller: DpartmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DpartmentController],
    }).compile();

    controller = module.get<DpartmentController>(DpartmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
