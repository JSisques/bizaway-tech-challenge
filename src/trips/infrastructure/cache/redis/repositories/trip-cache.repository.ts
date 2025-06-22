import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/shared/infrastructure/redis/provider/redis.provider';
import { TripCacheRepository } from 'src/trips/application/ports/trip-cache.repository';
import { Trip } from 'src/trips/domain/trip';
import { TripRedisCacheMapper } from '../mapper/trip-cache.mapper';
import { TripRedisCacheEntity } from '../entities/trip-cache.entity';

/**
 * Redis implementation of the TripCacheRepository interface.
 * Handles caching of trip data in Redis.
 */
@Injectable()
export class TripRedisCacheRepository implements TripCacheRepository {
  private readonly logger = new Logger(TripRedisCacheRepository.name);
  private readonly ttl: number;

  /**
   * Creates an instance of TripRedisCacheRepository.
   * @param redisClient - The Redis client instance for database operations
   */
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {
    this.ttl = parseInt(process.env.REDIS_TTL) || 3600;
  }

  /**
   * Retrieves a trip or array of trips from the cache by key
   * @param cacheKey - The key to look up in the cache
   * @returns The cached trip(s) if found, null otherwise
   */
  public async get(cacheKey: string): Promise<Trip | Trip[] | null> {
    this.logger.log(`Getting trip from cache: ${cacheKey}`);
    const trip = await this.redisClient.get(cacheKey);
    if (!trip) return null;
    return TripRedisCacheMapper.toDomain(JSON.parse(trip));
  }

  /**
   * Stores a trip in the cache
   * @param cacheKey - The key to store the trip under
   * @param trip - The trip to cache
   */
  public async set(cacheKey: string, trip: Trip): Promise<void> {
    this.logger.log(`Setting trip in cache: ${cacheKey}`);
    await this.redisClient.set(cacheKey, JSON.stringify(trip), 'EX', this.ttl);
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
    this.logger.log(`Setting search query in cache: ${cacheKey}`);
    const tripEntities = trips.map((trip) =>
      TripRedisCacheMapper.toPersistence(trip),
    );
    await this.redisClient.set(
      cacheKey,
      JSON.stringify(tripEntities),
      'EX',
      this.ttl,
    );
    return trips;
  }

  /**
   * Retrieves cached search results
   * @param cacheKey - The key to look up the search results
   * @returns Array of cached trips if found, null otherwise
   */
  public async getSearchQuery(cacheKey: string): Promise<Trip[] | null> {
    this.logger.log(`Getting search query from cache: ${cacheKey}`);
    const trips = await this.redisClient.get(cacheKey);
    if (!trips) return null;
    return JSON.parse(trips).map((trip: TripRedisCacheEntity) =>
      TripRedisCacheMapper.toDomain(trip),
    );
  }

  /**
   * Removes a cached item
   * @param cacheKey - The key of the item to remove from cache
   */
  public async delete(cacheKey: string): Promise<void> {
    this.logger.log(`Deleting trip from cache: ${cacheKey}`);
    await this.redisClient.del(cacheKey);
  }
}
