export class InvalidTripPlaceException extends Error {
  constructor(value: string) {
    super(`Invalid trip place: ${value}`);
    this.name = InvalidTripPlaceException.name;
  }
}
