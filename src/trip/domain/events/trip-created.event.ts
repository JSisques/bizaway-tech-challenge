import { Trip } from '../trip';

export class TripCreatedEvent {
  constructor(public readonly trip: Trip) {}
}
