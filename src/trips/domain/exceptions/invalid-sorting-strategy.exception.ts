import { BadRequestException } from '@nestjs/common';

export class InvalidSortingStrategyException extends BadRequestException {
  constructor(strategy: string) {
    super(`Invalid sorting strategy: ${strategy}`);
    this.name = InvalidSortingStrategyException.name;
  }
}
