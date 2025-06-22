import { randomUUID } from 'crypto';
import { Trip } from '../trip';
import { TripPlace } from '../value-objects/trip-place';
import { TripType } from '../value-objects/trip-type';

/**
 * Factory class for creating Trip domain objects
 */
export class TripFactory {
  /**
   * Creates a new Trip instance with the given parameters
   * @param origin - The origin location of the trip
   * @param destination - The destination location of the trip
   * @param cost - The cost of the trip
   * @param duration - The duration of the trip in minutes
   * @param type - The type of transportation for the trip
   * @returns A new Trip domain object
   */
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
