import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';
import { TripUpdatedEvent } from 'src/trip/domain/events/trip-updated.event';

@EventsHandler(TripUpdatedEvent)
export class TripUpdatedEventHandler {
  private readonly logger = new Logger(TripUpdatedEventHandler.name);

  async handle(event: TripUpdatedEvent): Promise<void> {
    this.logger.debug('Executing TripUpdatedEvent');

    /**
     * Here we could implement some logic after a trip is updated
     */
  }
}
