export class InvalidTripTypeException extends Error {
  constructor(value: string) {
    super(`Invalid trip type: ${value}`);
    this.name = InvalidTripTypeException.name;
  }
}
