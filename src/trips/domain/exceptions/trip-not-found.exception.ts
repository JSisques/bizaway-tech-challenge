import { NotFoundException } from '@nestjs/common';

export class TripNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
    this.name = 'TripNotFoundException';
  }
}
