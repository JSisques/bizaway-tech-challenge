import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TripRepository } from '../ports/trip.repository';
import { Logger } from '@nestjs/common';
import { UpdateTripCommand } from './update-trip.command';
import { Trip } from 'src/trips/domain/trip';
import { TripUpdatedEvent } from 'src/trips/domain/events/trip-updated.event';
import { TripFactory } from 'src/trips/domain/factories/trip.factory';
import { TripNotFoundException } from 'src/trips/domain/exceptions/trip-not-found.exception';

/**
 * Command handler responsible for updating existing trips
 */
@CommandHandler(UpdateTripCommand)
export class UpdateTripCommandHandler
  implements ICommandHandler<UpdateTripCommand>
{
  private readonly logger = new Logger(UpdateTripCommandHandler.name);

  /**
   * Creates an instance of UpdateTripCommandHandler
   * @param tripFactory - Factory for creating Trip domain objects
   * @param tripRepository - Repository for trip persistence operations
   * @param eventBus - Event bus for publishing domain events
   */
  constructor(
    private readonly tripFactory: TripFactory,
    private readonly tripRepository: TripRepository,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Executes the update trip command
   * @param command - Command containing trip update data
   * @returns Updated Trip domain object
   * @throws {TripNotFoundException} When trip with given id is not found
   */
  async execute(command: UpdateTripCommand): Promise<Trip> {
    this.logger.debug('Executing UpdateTripCommand');
    const trip = await this.tripRepository.findById(command.trip.id);

    if (!trip)
      throw new TripNotFoundException(
        `Trip with id ${command.trip.id} not found`,
      );

    const updatedTrip = Trip.fromPrimitives({
      ...trip.toPrimitives(),
      ...command.trip,
    });

    await this.tripRepository.update(updatedTrip);
    this.eventBus.publish(new TripUpdatedEvent(updatedTrip));

    return updatedTrip;
  }
}
