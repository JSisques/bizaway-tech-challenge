import { QueryHandler } from '@nestjs/cqrs';
import { TripRepository } from '../ports/trip.repository';
import { GetAllTripsQuery } from './get-all-trips.query';
import { Trip } from 'src/trip/domain/trip';
import { Logger } from '@nestjs/common';

@QueryHandler(GetAllTripsQuery)
export class GetAllTripsQueryHandler {
  private readonly logger = new Logger(GetAllTripsQueryHandler.name);

  constructor(private readonly tripRepository: TripRepository) {}

  async execute(query: GetAllTripsQuery): Promise<Trip[]> {
    this.logger.debug('Executing GetAllTripsQuery');

    const trips = await this.tripRepository.findAll();
    return this.tripRepository.findAll();
  }
}
