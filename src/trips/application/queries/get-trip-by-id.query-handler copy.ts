import { QueryHandler } from '@nestjs/cqrs';
import { TripRepository } from '../ports/trip.repository';
import { Trip } from 'src/trips/domain/trip';
import { Logger } from '@nestjs/common';
import { GetTripByIdQuery } from './get-trip-by-id.query';

@QueryHandler(GetTripByIdQuery)
export class GetTripByIdQueryHandler {
  private readonly logger = new Logger(GetTripByIdQueryHandler.name);

  constructor(private readonly tripRepository: TripRepository) {}

  async execute(query: GetTripByIdQuery): Promise<Trip> {
    this.logger.debug('Executing GetTripByIdQuery');

    return await this.tripRepository.findById(query.id);
  }
}
