import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TripRepository } from '../ports/trip.repository';
import { GetAllTripsQuery } from './get-all-trips.query';
import { Trip } from 'src/trips/domain/trip';
import { Logger } from '@nestjs/common';

@QueryHandler(GetAllTripsQuery)
export class GetAllTripsQueryHandler
  implements IQueryHandler<GetAllTripsQuery>
{
  private readonly logger = new Logger(GetAllTripsQueryHandler.name);

  constructor(private readonly tripRepository: TripRepository) {}

  async execute(): Promise<Trip[]> {
    this.logger.debug('Executing GetAllTripsQuery');

    return await this.tripRepository.findAll();
  }
}
