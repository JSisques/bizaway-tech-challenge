import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

/**
 * Exception thrown when an invalid sorting strategy is provided
 */
export class InvalidSortingStrategyException extends DomainException {
  constructor(strategy: string) {
    super(`Invalid sorting strategy: ${strategy}`);
  }
}
