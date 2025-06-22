import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { GetAllTripsQueryHandler } from './get-all-trips.query-handler';
import { TripRepository } from '../ports/trip.repository';
import { Trip } from 'src/trips/domain/trip';
import { TripPrimitive } from 'src/trips/domain/primitives/trip.primitive';

// Mock data
const mockTripPrimitive: TripPrimitive = {
  id: '1',
  origin: 'MAD',
  destination: 'BCN',
  cost: 100,
  duration: 120,
  type: 'train',
  displayName: 'from MAD to BCN by train',
};
const mockTrip = Trip.fromPrimitives(mockTripPrimitive);

describe('GetAllTripsQueryHandler', () => {
  let handler: GetAllTripsQueryHandler;
  let tripRepository: TripRepository;

  const mockTripRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllTripsQueryHandler,
        { provide: TripRepository, useValue: mockTripRepository },
      ],
    })
      .setLogger(new Logger())
      .compile();

    handler = module.get<GetAllTripsQueryHandler>(GetAllTripsQueryHandler);
    tripRepository = module.get<TripRepository>(TripRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should call repository.findAll and return a list of trips', async () => {
      mockTripRepository.findAll.mockResolvedValue([mockTrip]);

      const result = await handler.execute();

      expect(result).toEqual([mockTrip]);
      expect(tripRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array if no trips are found', async () => {
      mockTripRepository.findAll.mockResolvedValue([]);

      const result = await handler.execute();

      expect(result).toEqual([]);
      expect(tripRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the repository throws an error', async () => {
      const repositoryError = new Error('Database error');
      mockTripRepository.findAll.mockRejectedValue(repositoryError);

      await expect(handler.execute()).rejects.toThrow('Database error');
    });
  });
});
