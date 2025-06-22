import { InvalidTripTypeException } from '../exceptions/invalid-trip-type.exception';

export class TripType {
  constructor(public readonly value: string) {
    this.value = this.format(value);
    this.validate();
  }

  equals(other: TripType): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }

  private validate(): void {
    if (typeof this.value !== 'string') {
      throw new InvalidTripTypeException('Trip type must be a string');
    }
    if (this.value === undefined || this.value === '') {
      throw new InvalidTripTypeException('Trip type is required');
    }
  }

  private format(value: string): string {
    return value.toLowerCase().trim();
  }
}
