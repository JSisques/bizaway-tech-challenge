import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { SaveTripCommandHandler } from './save-trip.command-handler';
import { TripRepository } from '../ports/trip.repository';
import { TripFactory } from 'src/trips/domain/factories/trip.factory';
import { SaveTripCommand } from './save-trip.command';
import { Trip } from 'src/trips/domain/trip';
import { TripSavedEvent } from 'src/trips/domain/events/trip-saved.event';
import { InvalidTripPlaceException } from 'src/trips/domain/exceptions/invalid-trip-place.exception';

// Mocks
const mockTrip = {
  id: '123-abc',
  // ...other properties
} as Trip;

const tripFactoryMock = {
  create: jest.fn(),
};

const tripRepositoryMock = {
  save: jest.fn(),
};

const eventBusMock = {
  publish: jest.fn(),
};

describe('SaveTripCommandHandler', () => {
  let handler: SaveTripCommandHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveTripCommandHandler,
        { provide: TripFactory, useValue: tripFactoryMock },
        { provide: TripRepository, useValue: tripRepositoryMock },
        { provide: EventBus, useValue: eventBusMock },
      ],
    }).compile();

    handler = module.get<SaveTripCommandHandler>(SaveTripCommandHandler);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    const command = new SaveTripCommand({
      origin: 'SYD',
      destination: 'MAD',
      cost: 500,
      duration: 12,
      type: 'flight',
    });

    it('should create, save, and publish a trip successfully', async () => {
      // Arrange
      tripFactoryMock.create.mockReturnValue(mockTrip);
      tripRepositoryMock.save.mockResolvedValue(undefined);

      // Act
      const result = await handler.execute(command);

      // Assert
      // 1. Check if factory was called correctly
      expect(tripFactoryMock.create).toHaveBeenCalledWith(
        command.trip.origin,
        command.trip.destination,
        command.trip.cost,
        command.trip.duration,
        command.trip.type,
      );
      expect(tripFactoryMock.create).toHaveBeenCalledTimes(1);

      // 2. Check if repository was called correctly
      expect(tripRepositoryMock.save).toHaveBeenCalledWith(mockTrip);
      expect(tripRepositoryMock.save).toHaveBeenCalledTimes(1);

      // 3. Check if event was published
      expect(eventBusMock.publish).toHaveBeenCalledWith(
        new TripSavedEvent(mockTrip),
      );
      expect(eventBusMock.publish).toHaveBeenCalledTimes(1);

      // 4. Check the result
      expect(result).toBe(mockTrip);
    });

    it('should throw exception if trip factory fails', async () => {
      // Arrange
      const factoryError = new InvalidTripPlaceException('INVALID');
      tripFactoryMock.create.mockImplementation(() => {
        throw factoryError;
      });

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        InvalidTripPlaceException,
      );

      // Ensure other methods were not called
      expect(tripRepositoryMock.save).not.toHaveBeenCalled();
      expect(eventBusMock.publish).not.toHaveBeenCalled();
    });

    it('should throw exception if repository fails', async () => {
      // Arrange
      const repositoryError = new Error('Database connection error');
      tripFactoryMock.create.mockReturnValue(mockTrip);
      tripRepositoryMock.save.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection error',
      );

      // Ensure event bus was not called
      expect(eventBusMock.publish).not.toHaveBeenCalled();
    });
  });
});
