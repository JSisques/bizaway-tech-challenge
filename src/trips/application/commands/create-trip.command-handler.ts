import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateTripCommand } from './create-trip.command';
import { TripRepository } from '../ports/trip.repository';
import { Logger } from '@nestjs/common';
import { TripFactory } from 'src/trips/domain/factories/trip.factory';
import { TripCreatedEvent } from 'src/trips/domain/events/trip-created.event';
import { randomUUID } from 'crypto';
import { Trip } from 'src/trips/domain/trip';

@CommandHandler(CreateTripCommand)
export class CreateTripCommandHandler
  implements ICommandHandler<CreateTripCommand>
{
  private readonly logger = new Logger(CreateTripCommandHandler.name);

  constructor(
    private readonly tripFactory: TripFactory,
    private readonly tripRepository: TripRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTripCommand): Promise<Trip> {
    this.logger.debug('Executing CreateTripCommand');
    const trip = this.tripFactory.create(
      command.trip.origin,
      command.trip.destination,
      command.trip.cost,
      command.trip.duration,
      command.trip.type,
    );
    await this.tripRepository.create(trip);
    this.eventBus.publish(new TripCreatedEvent(trip));

    return trip;
  }
}
