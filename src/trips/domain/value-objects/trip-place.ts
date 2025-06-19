import { SUPPORTED_PLACES } from 'src/common/constants/supported-places.constant';
import { InvalidTripPlaceException } from '../exceptions/invalid-trip-place.exception';

export class TripPlace {
  constructor(public readonly value: string) {
    this.value = this.format(value);
    this.validate(this.value);
  }

  equals(other: TripPlace): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }

  private validate(value: string): void {
    if (!Object.values(SUPPORTED_PLACES).includes(value)) {
      throw new InvalidTripPlaceException(value);
    }
  }

  private format(value: string): string {
    return value.toUpperCase().trim();
  }
}
