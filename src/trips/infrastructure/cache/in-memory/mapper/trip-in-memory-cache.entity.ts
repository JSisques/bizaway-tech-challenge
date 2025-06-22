import { Trip } from 'src/trips/domain/trip';
import { TripInMemoryCacheEntity } from '../entities/trip-in-memory-cache.entity';

/**
 * Mapper class to convert between Trip domain objects and in-memory cache entities
 */
export class TripInMemoryCacheMapper {
  /**
   * Converts an in-memory cache entity to a Trip domain object
   * @param entity The in-memory cache entity to convert
   * @returns A Trip domain object
   */
  static toDomain(entity: TripInMemoryCacheEntity): Trip {
    return Trip.fromPrimitives(entity);
  }

  /**
   * Converts a Trip domain object to an in-memory cache entity
   * @param trip The Trip domain object to convert
   * @returns An in-memory cache entity
   */
  static toPersistence(trip: Trip): TripInMemoryCacheEntity {
    return trip.toPrimitives();
  }
}
