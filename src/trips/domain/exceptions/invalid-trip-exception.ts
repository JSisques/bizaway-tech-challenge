import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

export class InvalidTripException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
