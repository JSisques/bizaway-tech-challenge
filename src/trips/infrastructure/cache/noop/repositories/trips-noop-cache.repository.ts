import { Injectable, Logger } from '@nestjs/common';
import { TripCacheRepository } from 'src/trips/application/ports/trip-cache.repository';
import { Trip } from 'src/trips/domain/trip';

/**
 * No-operation implementation of the TripCacheRepository interface.
 * This implementation does not actually cache anything and always returns null.
 * Useful for testing or when caching needs to be disabled.
 */
@Injectable()
export class NoopCacheTripRepository implements TripCacheRepository {
  private readonly logger = new Logger(NoopCacheTripRepository.name);

  async get(cacheKey: string): Promise<Trip | null> {
    this.logger.debug(`Getting trip by cacheKey: ${cacheKey}`);
    return null;
  }
  async set(cacheKey: string, trip: Trip): Promise<void> {
    this.logger.debug(`Setting trip: ${trip}`);
  }
  async setSearchQuery(cacheKey: string, trips: Trip[]): Promise<Trip[]> {
    this.logger.debug(`Setting trips: ${trips}`);
    return trips;
  }
  async getSearchQuery(cacheKey: string): Promise<Trip[] | null> {
    this.logger.debug(`Getting trips by cacheKey: ${cacheKey}`);
    return null;
  }
  async delete(cacheKey: string): Promise<void> {
    this.logger.debug(`Deleting trip with cacheKey: ${cacheKey}`);
  }
}
