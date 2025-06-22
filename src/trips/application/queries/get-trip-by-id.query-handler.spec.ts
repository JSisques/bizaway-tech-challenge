import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { GetTripByIdQueryHandler } from './get-trip-by-id.query-handler';
import { TripRepository } from '../ports/trip.repository';
import { Trip } from 'src/trips/domain/trip';
import { TripPrimitive } from 'src/trips/domain/primitives/trip.primitive';
import { GetTripByIdQuery } from './get-trip-by-id.query';
import { TripNotFoundException } from 'src/trips/domain/exceptions/trip-not-found.exception';

// Mock data
const mockTripId = 'a749c866-7928-4d08-9d5c-a6821a583d1a';
const mockTripPrimitive: TripPrimitive = {
  id: mockTripId,
  origin: 'MAD',
  destination: 'BCN',
  cost: 100,
  duration: 120,
  type: 'train',
  displayName: 'from MAD to BCN by train',
};
const mockTrip = Trip.fromPrimitives(mockTripPrimitive);

describe('GetTripByIdQueryHandler', () => {
  let handler: GetTripByIdQueryHandler;
  let tripRepository: TripRepository;

  const mockTripRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTripByIdQueryHandler,
        { provide: TripRepository, useValue: mockTripRepository },
      ],
    })
      .setLogger(new Logger())
      .compile();

    handler = module.get<GetTripByIdQueryHandler>(GetTripByIdQueryHandler);
    tripRepository = module.get<TripRepository>(TripRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should call repository.findById and return a trip if found', async () => {
      mockTripRepository.findById.mockResolvedValue(mockTrip);
      const query = new GetTripByIdQuery(mockTripId);

      const result = await handler.execute(query);

      expect(result).toEqual(mockTrip);
      expect(tripRepository.findById).toHaveBeenCalledWith(mockTripId);
      expect(tripRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw TripNotFoundException if trip is not found', async () => {
      mockTripRepository.findById.mockResolvedValue(null);
      const query = new GetTripByIdQuery(mockTripId);

      await expect(handler.execute(query)).rejects.toThrow(
        TripNotFoundException,
      );
      await expect(handler.execute(query)).rejects.toThrow(
        `Trip with id ${mockTripId} not found`,
      );
    });

    it('should throw an error if the repository throws an error', async () => {
      const repositoryError = new Error('Database connection failed');
      mockTripRepository.findById.mockRejectedValue(repositoryError);
      const query = new GetTripByIdQuery(mockTripId);

      await expect(handler.execute(query)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
