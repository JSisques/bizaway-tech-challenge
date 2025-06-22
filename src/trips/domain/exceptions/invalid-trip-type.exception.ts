import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when an invalid trip type is provided
 */
export class InvalidTripTypeException extends DomainException {
  constructor(value: string) {
    super(`Invalid trip type: ${value}`);
  }
}
