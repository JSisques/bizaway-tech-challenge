export class TripType {
  constructor(public readonly value: string) {
    this.value = this.format(value);
  }

  equals(other: TripType): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }

  private format(value: string): string {
    return value.toLowerCase().trim();
  }
}
