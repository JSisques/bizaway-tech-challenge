import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';
import { TripDeletedEvent } from 'src/trips/domain/events/trip-deleted.event';

@EventsHandler(TripDeletedEvent)
export class TripDeletedEventHandler {
  private readonly logger = new Logger(TripDeletedEventHandler.name);

  async handle(event: TripDeletedEvent): Promise<void> {
    this.logger.debug('Executing TripDeletedEvent');

    /**
     * Here we could implement some logic after a trip is deleted
     */
  }
}
