import { Trip } from '../trip';

export class TripUpdatedEvent {
  constructor(public readonly trip: Trip) {}
}
