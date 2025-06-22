import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when an invalid trip place is provided
 */
export class InvalidTripPlaceException extends DomainException {
  constructor(place: string) {
    super(`Invalid trip place: ${place}`);
  }
}
