import { TripPrimitive } from './primitives/trip.primitive';
import { TripPlace } from './value-objects/trip-place';
import { TripType } from './value-objects/trip-type';

export class Trip {
  public readonly displayName: string;

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

  private generateDisplayName(): string {
    return `from ${this.origin.getValue()} to ${this.destination.getValue()} by ${this.type.getValue()}`;
  }

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
}
