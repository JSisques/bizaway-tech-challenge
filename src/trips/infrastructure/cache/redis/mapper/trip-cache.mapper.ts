import { Trip } from 'src/trips/domain/trip';
import { TripRedisCacheEntity } from '../entities/trip-cache.entity';

/**
 * Mapper class to convert between Trip domain objects and Redis cache entities
 */
export class TripRedisCacheMapper {
  /**
   * Converts a Redis cache entity to a Trip domain object
   * @param entity The Redis cache entity to convert
   * @returns A Trip domain object
   */
  static toDomain(entity: TripRedisCacheEntity): Trip {
    return Trip.fromPrimitives(entity);
  }

  /**
   * Converts a Trip domain object to a Redis cache entity
   * @param trip The Trip domain object to convert
   * @returns A Redis cache entity
   */
  static toPersistence(trip: Trip): TripRedisCacheEntity {
    return trip.toPrimitives();
  }
}
