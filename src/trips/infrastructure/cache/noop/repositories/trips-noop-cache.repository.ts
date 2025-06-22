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

  /**
   * Simulates retrieving a trip from cache but always returns null
   * @param cacheKey - The key to look up in the cache
   * @returns Always returns null since this is a no-op implementation
   */
  async get(cacheKey: string): Promise<Trip | null> {
    this.logger.debug(`Getting trip by cacheKey: ${cacheKey}`);
    return null;
  }

  /**
   * Simulates storing a trip in cache but performs no operation
   * @param cacheKey - The key to store the trip under
   * @param trip - The trip that would be cached
   */
  async set(cacheKey: string, trip: Trip): Promise<void> {
    this.logger.debug(`Setting trip: ${trip}`);
  }

  /**
   * Simulates caching search results but only returns the input trips
   * @param cacheKey - The key to store the search results under
   * @param trips - Array of trips that would be cached
   * @returns The same trips array that was passed in
   */
  async setSearchQuery(cacheKey: string, trips: Trip[]): Promise<Trip[]> {
    this.logger.debug(`Setting trips: ${trips}`);
    return trips;
  }

  /**
   * Simulates retrieving cached search results but always returns null
   * @param cacheKey - The key to look up the search results
   * @returns Always returns null since this is a no-op implementation
   */
  async getSearchQuery(cacheKey: string): Promise<Trip[] | null> {
    this.logger.debug(`Getting trips by cacheKey: ${cacheKey}`);
    return null;
  }

  /**
   * Simulates removing a cached item but performs no operation
   * @param cacheKey - The key of the item that would be removed from cache
   */
  async delete(cacheKey: string): Promise<void> {
    this.logger.debug(`Deleting trip with cacheKey: ${cacheKey}`);
  }
}
