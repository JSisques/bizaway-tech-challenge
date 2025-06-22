import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/shared/infrastructure/redis/provider/redis.provider';
import { TripCacheRepository } from 'src/trips/application/ports/trip-cache.repository';
import { Trip } from 'src/trips/domain/trip';
import { TripRedisCacheMapper } from '../mapper/trip-cache.mapper';
import { TripRedisCacheEntity } from '../entities/trip-cache.entity';

/**
 * Redis implementation of the UserCacheRepository interface.
 * Handles caching of user data in Redis.
 */
@Injectable()
export class TripRedisCacheRepository implements TripCacheRepository {
  private readonly logger = new Logger(TripRedisCacheRepository.name);

  /**
   * Creates an instance of RedisCacheUserRepository.
   * @param redisClient - The Redis client instance for database operations
   */
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis) {}

  public async get(cacheKey: string): Promise<Trip | Trip[] | null> {
    const trip = await this.redisClient.get(cacheKey);
    if (!trip) return null;
    return TripRedisCacheMapper.toDomain(JSON.parse(trip));
  }
  public async set(cacheKey: string, trip: Trip): Promise<void> {
    await this.redisClient.set(cacheKey, JSON.stringify(trip));
  }
  public async setSearchQuery(
    cacheKey: string,
    trips: Trip[],
  ): Promise<Trip[]> {
    const tripEntities = trips.map((trip) =>
      TripRedisCacheMapper.toPersistence(trip),
    );
    await this.redisClient.set(cacheKey, JSON.stringify(tripEntities));
    return trips;
  }
  public async getSearchQuery(cacheKey: string): Promise<Trip[] | null> {
    const trips = await this.redisClient.get(cacheKey);
    if (!trips) return null;
    return JSON.parse(trips).map((trip: TripRedisCacheEntity) =>
      TripRedisCacheMapper.toDomain(trip),
    );
  }
  public async delete(cacheKey: string): Promise<void> {
    await this.redisClient.del(cacheKey);
  }
}
