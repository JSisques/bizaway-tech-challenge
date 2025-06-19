import { Trip } from '../trip';

export class TripSavedEvent {
  constructor(public readonly trip: Trip) {}
}
