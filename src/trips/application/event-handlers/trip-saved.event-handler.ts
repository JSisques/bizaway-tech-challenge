import { Logger } from '@nestjs/common';
import { EventsHandler } from '@nestjs/cqrs';
import { TripSavedEvent } from 'src/trips/domain/events/trip-saved.event';

@EventsHandler(TripSavedEvent)
export class TripSavedEventHandler {
  private readonly logger = new Logger(TripSavedEventHandler.name);

  async handle(event: TripSavedEvent): Promise<void> {
    this.logger.debug(
      `Executing TripSavedEvent for trip ${event.trip.id}`,
      event.trip,
    );

    /**
     * Here we could implement some logic after a trip is saved
     */
  }
}
