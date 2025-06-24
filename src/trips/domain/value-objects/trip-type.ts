import { InvalidTripTypeException } from '../exceptions/invalid-trip-type.exception';

/**
 * Value object representing a trip type
 */
export class TripType {
  /**
   * Creates a new TripType instance
   * @param value - The string value representing the trip type
   * @throws {InvalidTripTypeException} If the value is not a valid trip type
   */
  constructor(public readonly value: string) {
    this.value = this.format(value);
    this.validate();
  }

  /**
   * Checks if this trip type equals another trip type
   * @param other - The other trip type to compare with
   * @returns True if both trip types have the same value, false otherwise
   */
  equals(other: TripType): boolean {
    return this.value === other.value;
  }

  /**
   * Gets the trip type value
   * @returns The string value of the trip type
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Validates that the trip type value is valid
   * @throws {InvalidTripTypeException} If the value is not a string or is empty
   */
  private validate(): void {
    if (typeof this.value !== 'string') {
      throw new InvalidTripTypeException('Trip type must be a string');
    }
    if (this.value === undefined || this.value === '') {
      throw new InvalidTripTypeException('Trip type is required');
    }
  }

  /**
   * Formats the trip type value by converting to lowercase and trimming whitespace
   * @param value - The value to format
   * @returns The formatted string value
   */
  private format(value: string): string {
    return value.toLowerCase().trim();
  }
}
