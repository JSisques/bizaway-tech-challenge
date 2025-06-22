import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when a trip is not found
 */
export class TripNotFoundException extends DomainException {
  constructor(id: string) {
    super(`Trip with id ${id} not found`);
  }
}
