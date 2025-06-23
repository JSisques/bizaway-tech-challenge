import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchTripQuery } from './search-trip.query';
import { Trip } from 'src/trips/domain/trip';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { TripCacheRepository } from '../ports/trip-cache.repository';
import { TripSortingService } from 'src/trips/domain/services/trip-sorting.service';

@QueryHandler(SearchTripQuery)
export class SearchQueryHandler implements IQueryHandler<SearchTripQuery> {
  private readonly logger = new Logger(SearchQueryHandler.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly tripCacheRepository: TripCacheRepository,
    private readonly httpService: HttpService,
    private readonly tripSortingService: TripSortingService,
  ) {}

  async execute(query: SearchTripQuery): Promise<Trip[]> {
    this.logger.debug('Executing SearchQuery');

    const cacheKey = `${query.origin}-${query.destination}-${query.sortBy}`;
    const cachedTrips = await this.tripCacheRepository.getSearchQuery(cacheKey);

    this.logger.debug('Cached trips:', JSON.stringify(cachedTrips));

    if (cachedTrips) {
      this.logger.debug(
        `Returning cached trips ${JSON.stringify(cachedTrips)}`,
      );
      return cachedTrips;
    }

    const apiUrl = this.configService.get('API_URL');
    const apiKey = this.configService.get('API_KEY');

    if (!apiUrl) throw new Error('API URL is not set');
    if (!apiKey) throw new Error('API Key is not set');

    this.logger.debug('API URL:', apiUrl);

    const { data: responseData, status: responseStatus } = await lastValueFrom(
      this.httpService.get(apiUrl, {
        params: {
          origin: query.origin,
          destination: query.destination,
        },
        headers: {
          'x-api-key': apiKey,
        },
      }),
    );

    //TODO: Refactor this to use a proper error handling
    if (responseStatus !== 200)
      throw new Error('Failed to fetch data from external API');

    this.logger.debug(`Response status: ${responseStatus}`);
    this.logger.debug(`Response data: ${JSON.stringify(responseData)}`);

    const trips = responseData.map((trip) => {
      return Trip.fromPrimitives({
        ...trip,
      });
    });

    const sortedTrips = this.tripSortingService.sortTrips(trips, query.sortBy);

    // We cache the trips following search query as id
    await this.tripCacheRepository.setSearchQuery(cacheKey, sortedTrips);

    return sortedTrips;
  }
}
