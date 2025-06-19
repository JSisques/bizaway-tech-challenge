import { randomUUID } from 'crypto';
import { TripPrimitive } from '../primitives/trip.primitive';
import { Trip } from '../trip';
import { TripPlace } from '../value-objects/trip-place';
import { TripType } from '../value-objects/trip-type';

export class TripFactory {
  create(
    origin: string,
    destination: string,
    cost: number,
    duration: number,
    type: string,
  ): Trip {
    return new Trip(
      randomUUID(),
      new TripPlace(origin),
      new TripPlace(destination),
      cost,
      duration,
      new TripType(type),
    );
  }
}
