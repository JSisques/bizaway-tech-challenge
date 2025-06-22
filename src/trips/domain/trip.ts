import { InvalidTripException } from './exceptions/invalid-trip-exception';
import { TripPrimitive } from './primitives/trip.primitive';
import { TripPlace } from './value-objects/trip-place';
import { TripType } from './value-objects/trip-type';

/**
 * Represents a Trip domain entity
 */
export class Trip {
  /** Human readable representation of the trip */
  public readonly displayName: string;

  /**
   * Creates a new Trip instance
   * @param id - Unique identifier for the trip
   * @param origin - Starting location of the trip
   * @param destination - End location of the trip
   * @param cost - Cost of the trip
   * @param duration - Duration of the trip in minutes
   * @param type - Type of transportation for the trip
   */
  constructor(
    public readonly id: string,
    public readonly origin: TripPlace,
    public readonly destination: TripPlace,
    public readonly cost: number,
    public readonly duration: number,
    public readonly type: TripType,
  ) {
    this.displayName = this.generateDisplayName();
  }

  /**
   * Generates a human readable string representation of the trip
   * @returns Formatted string with origin, destination and transport type
   * @private
   */
  private generateDisplayName(): string {
    return `from ${this.origin.getValue()} to ${this.destination.getValue()} by ${this.type.getValue()}`;
  }

  /**
   * Converts the Trip domain object to a primitive representation
   * @returns Trip data in primitive form
   */
  toPrimitives(): TripPrimitive {
    return new TripPrimitive(
      this.id,
      this.origin.getValue(),
      this.destination.getValue(),
      this.cost,
      this.duration,
      this.type.getValue(),
      this.displayName,
    );
  }

  /**
   * Creates a Trip domain object from primitive data
   * @param trip - Trip data in primitive form
   * @returns New Trip domain object
   */
  static fromPrimitives(trip: TripPrimitive): Trip {
    return new Trip(
      trip.id,
      new TripPlace(trip.origin),
      new TripPlace(trip.destination),
      trip.cost,
      trip.duration,
      new TripType(trip.type),
    );
  }

  private validate(): void {
    if (this.origin.getValue() === this.destination.getValue()) {
      throw new InvalidTripException(
        'Origin and destination cannot be the same',
      );
    }

    if (this.cost <= 0) {
      throw new InvalidTripException('Cost must be greater than 0');
    }

    if (this.duration <= 0) {
      throw new InvalidTripException('Duration must be greater than 0');
    }
  }
}
