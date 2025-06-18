import { Trip } from '../trip';

export class TripDeletedEvent {
  constructor(public readonly trip: Trip) {}
}
