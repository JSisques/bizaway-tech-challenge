import { SUPPORTED_PLACES } from 'src/common/constants/supported-places.constant';
import { InvalidTripPlaceException } from '../exceptions/invalid-trip-place.exception';

/**
 * Value object representing a place/location in a trip
 */
export class TripPlace {
  /**
   * Creates a new TripPlace instance
   * @param value - The place identifier string
   * @throws {InvalidTripPlaceException} If the place is not in the supported places list
   */
  constructor(public readonly value: string) {
    this.value = this.format(value);
    this.validate(this.value);
  }

  /**
   * Checks if this place equals another TripPlace
   * @param other - The TripPlace to compare with
   * @returns True if both places have the same value
   */
  equals(other: TripPlace): boolean {
    return this.value === other.value;
  }

  /**
   * Gets the place value
   * @returns The formatted place string value
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Validates that the place is supported
   * @param value - The place string to validate
   * @throws {InvalidTripPlaceException} If the place is not supported
   */
  private validate(value: string): void {
    if (!Object.values(SUPPORTED_PLACES).includes(value)) {
      throw new InvalidTripPlaceException(value);
    }
  }

  /**
   * Formats the place string value
   * @param value - The place string to format
   * @returns The formatted place string in uppercase and trimmed
   */
  private format(value: string): string {
    return value.toUpperCase().trim();
  }
}
