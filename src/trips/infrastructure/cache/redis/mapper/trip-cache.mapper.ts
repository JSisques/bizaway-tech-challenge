import { Trip } from 'src/trips/domain/trip';
import { TripRedisCacheEntity } from '../entities/trip-cache.entity';

export class TripRedisCacheMapper {
  static toDomain(entity: TripRedisCacheEntity): Trip {
    return Trip.fromPrimitives(entity);
  }

  static toPersistence(trip: Trip): TripRedisCacheEntity {
    return trip.toPrimitives();
  }
}
