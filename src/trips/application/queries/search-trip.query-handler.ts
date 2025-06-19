import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchTripQuery } from './search-trip.query';
import { TripRepository } from '../ports/trip.repository';
import { Trip } from 'src/trips/domain/trip';
import { Logger } from '@nestjs/common';

@QueryHandler(SearchTripQuery)
export class SearchQueryHandler implements IQueryHandler<SearchTripQuery> {
  private readonly logger = new Logger(SearchQueryHandler.name);

  constructor(private readonly tripRepository: TripRepository) {}

  async execute(query: SearchTripQuery): Promise<Trip[]> {
    this.logger.debug('Executing SearchQuery');

    return await this.tripRepository.search(query);
  }
}
