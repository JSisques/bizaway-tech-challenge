import { Trip } from 'src/trips/domain/trip';
import { TripInMemoryCacheEntity } from '../entities/trip-in-memory-cache.entity';

export class TripInMemoryCacheMapper {
  static toDomain(entity: TripInMemoryCacheEntity): Trip {
    return Trip.fromPrimitives(entity);
  }

  static toPersistence(trip: Trip): TripInMemoryCacheEntity {
    return trip.toPrimitives();
  }
}
