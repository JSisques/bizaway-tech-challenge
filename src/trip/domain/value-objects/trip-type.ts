export class TripType {
  constructor(public readonly value: string) {}

  equals(other: TripType): boolean {
    return this.value === other.value;
  }

  getValue(): string {
    return this.value;
  }
}
