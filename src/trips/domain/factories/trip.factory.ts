import { TripPrimitive } from '../primitives/trip.primitive';
import { Trip } from '../trip';
import { TripPlace } from '../value-objects/trip-place';
import { TripType } from '../value-objects/trip-type';

export class TripFactory {
  static create(trip: TripPrimitive): Trip {
    return new Trip(
      trip.id,
      new TripPlace(trip.origin),
      new TripPlace(trip.destination),
      trip.cost,
      trip.duration,
      new TripType(trip.type),
      trip.displayName,
    );
  }
}
