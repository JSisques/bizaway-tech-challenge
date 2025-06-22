import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { SaveTripCommand } from './save-trip.command';
import { TripRepository } from '../ports/trip.repository';
import { Logger } from '@nestjs/common';
import { TripFactory } from 'src/trips/domain/factories/trip.factory';
import { TripSavedEvent } from 'src/trips/domain/events/trip-saved.event';
import { Trip } from 'src/trips/domain/trip';

/**
 * Command handler responsible for saving new trips
 */
@CommandHandler(SaveTripCommand)
export class SaveTripCommandHandler
  implements ICommandHandler<SaveTripCommand>
{
  private readonly logger = new Logger(SaveTripCommandHandler.name);

  /**
   * Creates an instance of SaveTripCommandHandler
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
   * Executes the save trip command
   * @param command - Command containing trip creation data
   * @returns Newly created Trip domain object
   */
  async execute(command: SaveTripCommand): Promise<Trip> {
    this.logger.debug('Executing SaveTripCommand');
    const trip = this.tripFactory.create(
      command.trip.origin,
      command.trip.destination,
      command.trip.cost,
      command.trip.duration,
      command.trip.type,
    );
    await this.tripRepository.save(trip);
    this.eventBus.publish(new TripSavedEvent(trip));

    return trip;
  }
}
