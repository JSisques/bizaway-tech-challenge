import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './trips.controller';

describe('TripController', () => {
  let controller: TripController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
    }).compile();

    controller = module.get<TripController>(TripController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
