import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';
import { TripCreatedEvent } from 'src/trip/domain/events/trip-created.event';

@EventsHandler(TripCreatedEvent)
export class TripCreatedEventHandler {
  private readonly logger = new Logger(TripCreatedEventHandler.name);

  async handle(event: TripCreatedEvent): Promise<void> {
    this.logger.debug('Executing TripCreatedEvent');

    /**
     * Here we could implement some logic after a trip is created
     */
  }
}
