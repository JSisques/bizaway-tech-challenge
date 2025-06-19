import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { TripRepository } from '../ports/trip.repository';
import { Trip } from 'src/trips/domain/trip';
import { Logger } from '@nestjs/common';
import { GetTripByIdQuery } from './get-trip-by-id.query';
import { TripNotFoundException } from 'src/trips/domain/exceptions/trip-not-found.exception';

@QueryHandler(GetTripByIdQuery)
export class GetTripByIdQueryHandler
  implements IQueryHandler<GetTripByIdQuery>
{
  private readonly logger = new Logger(GetTripByIdQueryHandler.name);

  constructor(private readonly tripRepository: TripRepository) {}

  async execute(query: GetTripByIdQuery): Promise<Trip> {
    this.logger.debug('Executing GetTripByIdQuery');

    const trip = await this.tripRepository.findById(query.id);
    if (!trip)
      throw new TripNotFoundException(`Trip with id ${query.id} not found`);

    return trip;
  }
}
