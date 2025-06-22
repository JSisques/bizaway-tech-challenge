import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TripRepository } from '../ports/trip.repository';
import { Logger } from '@nestjs/common';
import { DeleteTripCommand } from './delete-trip.command';
import { Trip } from 'src/trips/domain/trip';
import { TripDeletedEvent } from 'src/trips/domain/events/trip-deleted.event';

/**
 * Command handler responsible for deleting existing trips
 */
@CommandHandler(DeleteTripCommand)
export class DeleteTripCommandHandler
  implements ICommandHandler<DeleteTripCommand>
{
  private readonly logger = new Logger(DeleteTripCommandHandler.name);

  /**
   * Creates an instance of DeleteTripCommandHandler
   * @param tripRepository - Repository for trip persistence operations
   * @param eventBus - Event bus for publishing domain events
   */
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly eventBus: EventBus,
  ) {}

  /**
   * Executes the delete trip command
   * @param command - Command containing trip id to delete
   * @returns Deleted Trip domain object
   */
  async execute(command: DeleteTripCommand): Promise<Trip> {
    this.logger.debug('Executing DeleteTripCommand');
    const trip = await this.tripRepository.findById(command.id);
    await this.tripRepository.delete(command.id);
    this.eventBus.publish(new TripDeletedEvent(trip));

    return trip;
  }
}
