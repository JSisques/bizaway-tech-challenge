import { Trip } from 'src/trips/domain/trip';

export abstract class TripCacheRepository {
  public abstract get(cacheKey: string): Promise<Trip | Trip[] | null>;
  public abstract set(cacheKey: string, trip: Trip): Promise<void>;
  public abstract setSearchQuery(
    cacheKey: string,
    trips: Trip[],
  ): Promise<Trip[]>;
  public abstract getSearchQuery(cacheKey: string): Promise<Trip[] | null>;
  public abstract delete(cacheKey: string): Promise<void>;
}
