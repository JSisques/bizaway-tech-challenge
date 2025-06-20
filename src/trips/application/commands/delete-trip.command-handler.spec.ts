import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { DeleteTripCommandHandler } from './delete-trip.command-handler';
import { TripRepository } from '../ports/trip.repository';
import { DeleteTripCommand } from './delete-trip.command';
import { Trip } from 'src/trips/domain/trip';
import { TripDeletedEvent } from 'src/trips/domain/events/trip-deleted.event';
import { TripPrimitive } from 'src/trips/domain/primitives/trip.primitive';

// Mocks
const mockExistingTripPrimitive: TripPrimitive = {
  id: '123-abc',
  origin: 'SYD',
  destination: 'MAD',
  cost: 500,
  duration: 12,
  type: 'flight',
  displayName: 'SYD -> MAD',
};

const mockExistingTrip = Trip.fromPrimitives(mockExistingTripPrimitive);

const tripRepositoryMock = {
  findById: jest.fn(),
  delete: jest.fn(),
};

const eventBusMock = {
  publish: jest.fn(),
};

describe('DeleteTripCommandHandler', () => {
  let handler: DeleteTripCommandHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTripCommandHandler,
        { provide: TripRepository, useValue: tripRepositoryMock },
        { provide: EventBus, useValue: eventBusMock },
      ],
    }).compile();

    handler = module.get<DeleteTripCommandHandler>(DeleteTripCommandHandler);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    const command = new DeleteTripCommand('123-abc');

    it('should find, delete, and publish an event for a trip successfully', async () => {
      // Arrange
      tripRepositoryMock.findById.mockResolvedValue(mockExistingTrip);
      tripRepositoryMock.delete.mockResolvedValue(undefined);

      // Act
      const result = await handler.execute(command);

      // Assert
      // 1. Check if repository.findById was called
      expect(tripRepositoryMock.findById).toHaveBeenCalledWith(command.id);
      expect(tripRepositoryMock.findById).toHaveBeenCalledTimes(1);

      // 2. Check if repository.delete was called
      expect(tripRepositoryMock.delete).toHaveBeenCalledWith(command.id);
      expect(tripRepositoryMock.delete).toHaveBeenCalledTimes(1);

      // 3. Check if event was published
      expect(eventBusMock.publish).toHaveBeenCalledWith(
        new TripDeletedEvent(mockExistingTrip),
      );
      expect(eventBusMock.publish).toHaveBeenCalledTimes(1);

      // 4. Check the result
      expect(result).toBe(mockExistingTrip);
    });

    it('should not throw if trip does not exist and publish event with null', async () => {
      // Arrange
      tripRepositoryMock.findById.mockResolvedValue(null);
      tripRepositoryMock.delete.mockResolvedValue(undefined);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(tripRepositoryMock.findById).toHaveBeenCalledWith(command.id);
      expect(tripRepositoryMock.delete).toHaveBeenCalledWith(command.id);

      // The current implementation publishes a "null" event.
      // This might be desired, but it's inconsistent with the Update handler that throws a NotFound exception.
      expect(eventBusMock.publish).toHaveBeenCalledWith(
        new TripDeletedEvent(null),
      );
      expect(result).toBeNull();
    });

    it('should throw exception if repository delete fails', async () => {
      // Arrange
      const repositoryError = new Error('Database connection error');
      tripRepositoryMock.findById.mockResolvedValue(mockExistingTrip);
      tripRepositoryMock.delete.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection error',
      );

      // Ensure event bus was not called
      expect(eventBusMock.publish).not.toHaveBeenCalled();
    });
  });
});
