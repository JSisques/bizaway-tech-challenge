import { Trip } from 'src/trips/domain/trip';
import { TripCacheRepository } from 'src/trips/application/ports/trip-cache.repository';
import { TripInMemoryCacheEntity } from '../entities/trip-in-memory-cache.entity';
import { TripInMemoryCacheMapper } from '../mapper/trip-in-memory-cache.mapper';
import { Logger } from '@nestjs/common';

interface CacheEntry {
  data: TripInMemoryCacheEntity | TripInMemoryCacheEntity[];
}

/**
 * In-memory implementation of the TripCacheRepository interface.
 * Handles caching of trip data in memory using a Map.
 */
export class TripsInMemoryCacheRepository implements TripCacheRepository {
  private readonly logger = new Logger(TripsInMemoryCacheRepository.name);

  private readonly trips: Map<string, CacheEntry> = new Map<
    string,
    CacheEntry
  >();

  /**
   * Retrieves a trip from the cache by key
   * @param cacheKey - The key to look up in the cache
   * @returns The cached trip if found, null otherwise
   */
  public async get(cacheKey: string): Promise<Trip | null> {
    const entity = this.trips.get(cacheKey);
    if (!entity) {
      return null;
    }
    return TripInMemoryCacheMapper.toDomain(entity.data[0]);
  }

  /**
   * Stores a trip in the cache
   * @param cacheKey - The key to store the trip under
   * @param trip - The trip to cache
   */
  public async set(cacheKey: string, trip: Trip): Promise<void> {
    this.logger.debug('set', JSON.stringify(trip));
    this.trips.set(cacheKey, {
      data: TripInMemoryCacheMapper.toPersistence(trip),
    });
  }

  /**
   * Caches the results of a search query
   * @param cacheKey - The key to store the search results under
   * @param trips - Array of trips to cache
   * @returns The cached trips array
   */
  public async setSearchQuery(
    cacheKey: string,
    trips: Trip[],
  ): Promise<Trip[]> {
    this.logger.debug('setSearchQuery', JSON.stringify(trips));
    const entities = trips.map((trip: Trip) =>
      TripInMemoryCacheMapper.toPersistence(trip),
    );

    this.logger.debug('entities', JSON.stringify(entities));
    this.trips.set(cacheKey, {
      data: entities,
    });
    return trips;
  }

  /**
   * Retrieves cached search results
   * @param cacheKey - The key to look up the search results
   * @returns Array of cached trips if found, null otherwise
   */
  public async getSearchQuery(cacheKey: string): Promise<Trip[] | null> {
    const entity = this.trips.get(cacheKey);
    if (!entity) {
      return null;
    }
    return (entity.data as TripInMemoryCacheEntity[]).map((entity) =>
      TripInMemoryCacheMapper.toDomain(entity),
    );
  }

  /**
   * Removes a cached item
   * @param cacheKey - The key of the item to remove from cache
   */
  public async delete(cacheKey: string): Promise<void> {
    this.trips.delete(cacheKey);
  }
}
