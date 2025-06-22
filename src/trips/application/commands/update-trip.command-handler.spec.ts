import { Test, TestingModule } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { UpdateTripCommandHandler } from './update-trip.command-handler';
import { TripRepository } from '../ports/trip.repository';
import { TripFactory } from 'src/trips/domain/factories/trip.factory';
import { UpdateTripCommand } from './update-trip.command';
import { Trip } from 'src/trips/domain/trip';
import { TripUpdatedEvent } from 'src/trips/domain/events/trip-updated.event';
import { TripNotFoundException } from 'src/trips/domain/exceptions/trip-not-found.exception';
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
  update: jest.fn(),
};

const eventBusMock = {
  publish: jest.fn(),
};

const tripFactoryMock = {};

describe('UpdateTripCommandHandler', () => {
  let handler: UpdateTripCommandHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateTripCommandHandler,
        { provide: TripRepository, useValue: tripRepositoryMock },
        { provide: TripFactory, useValue: tripFactoryMock },
        { provide: EventBus, useValue: eventBusMock },
      ],
    }).compile();

    handler = module.get<UpdateTripCommandHandler>(UpdateTripCommandHandler);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    const command = new UpdateTripCommand({
      id: '123-abc',
      cost: 600, // Update cost
    });

    it('should find, update, save, and publish a trip successfully', async () => {
      // Arrange
      tripRepositoryMock.findById.mockResolvedValue(mockExistingTrip);
      tripRepositoryMock.update.mockResolvedValue(undefined);

      const expectedUpdatedTrip = Trip.fromPrimitives({
        ...mockExistingTripPrimitive,
        cost: 600,
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      // 1. Check if repository.findById was called correctly
      expect(tripRepositoryMock.findById).toHaveBeenCalledWith(command.trip.id);
      expect(tripRepositoryMock.findById).toHaveBeenCalledTimes(1);

      // 2. Check if repository.update was called with the updated trip
      expect(tripRepositoryMock.update).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '123-abc',
          cost: 600,
        }),
      );
      expect(tripRepositoryMock.update).toHaveBeenCalledTimes(1);

      // 3. Check if event was published
      expect(eventBusMock.publish).toHaveBeenCalledWith(
        expect.any(TripUpdatedEvent),
      );
      expect(eventBusMock.publish).toHaveBeenCalledTimes(1);

      // 4. Check the result
      expect(result).toEqual(expectedUpdatedTrip);
    });

    it('should throw TripNotFoundException if trip does not exist', async () => {
      // Arrange
      tripRepositoryMock.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        TripNotFoundException,
      );
      await expect(handler.execute(command)).rejects.toThrow(
        `Trip with id ${command.trip.id} not found`,
      );

      // Ensure other methods were not called
      expect(tripRepositoryMock.update).not.toHaveBeenCalled();
      expect(eventBusMock.publish).not.toHaveBeenCalled();
    });

    it('should throw exception if repository update fails', async () => {
      // Arrange
      const repositoryError = new Error('Database connection error');
      tripRepositoryMock.findById.mockResolvedValue(mockExistingTrip);
      tripRepositoryMock.update.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow(
        'Database connection error',
      );

      // Ensure event bus was not called
      expect(eventBusMock.publish).not.toHaveBeenCalled();
    });
  });
});
