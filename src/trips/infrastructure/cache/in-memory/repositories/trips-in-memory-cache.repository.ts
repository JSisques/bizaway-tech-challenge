import { Trip } from 'src/trips/domain/trip';
import { TripCacheRepository } from 'src/trips/application/ports/trip-cache.repository';
import { TripInMemoryCacheEntity } from '../entities/trip-in-memory-cache.entity';
import { TripInMemoryCacheMapper } from '../mapper/trip-in-memory-cache.entity';
import { Logger } from '@nestjs/common';

interface CacheEntry {
  data: TripInMemoryCacheEntity | TripInMemoryCacheEntity[];
}

export class TripsInMemoryCacheRepository implements TripCacheRepository {
  private readonly logger = new Logger(TripsInMemoryCacheRepository.name);

  private readonly trips: Map<string, CacheEntry> = new Map<
    string,
    CacheEntry
  >();

  public async get(cacheKey: string): Promise<Trip | null> {
    const entity = this.trips.get(cacheKey);
    if (!entity) {
      return null;
    }
    return TripInMemoryCacheMapper.toDomain(entity.data[0]);
  }

  public async set(cacheKey: string, trip: Trip): Promise<void> {
    this.logger.debug('set', JSON.stringify(trip));
    this.trips.set(cacheKey, {
      data: TripInMemoryCacheMapper.toPersistence(trip),
    });
  }

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

  public async getSearchQuery(cacheKey: string): Promise<Trip[] | null> {
    const entity = this.trips.get(cacheKey);
    if (!entity) {
      return null;
    }
    return (entity.data as TripInMemoryCacheEntity[]).map((entity) =>
      TripInMemoryCacheMapper.toDomain(entity),
    );
  }
  public async delete(cacheKey: string): Promise<void> {
    this.trips.delete(cacheKey);
  }
}
