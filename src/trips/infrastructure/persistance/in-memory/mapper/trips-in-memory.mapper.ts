import { Trip } from 'src/trips/domain/trip';
import { TripInMemoryEntity } from '../entities/trip-in-memory.entity';

/**
 * Mapper class responsible for transforming between User domain objects and UserEntity persistence objects.
 */
export class TripsInMemoryMapper {
  /**
   * Converts a TripInMemoryEntity from the persistence layer to a Trip domain object
   * @param entity - The TripInMemoryEntity to convert
   * @returns A Trip domain object
   */
  static toDomain(entity: TripInMemoryEntity): Trip {
    return Trip.fromPrimitives(entity);
  }

  /**
   * Converts a Trip domain object to a TripInMemoryEntity for persistence
   * @param trip - The Trip domain object to convert
   * @returns A TripInMemoryEntity for persistence
   */
  static toPersistence(trip: Trip): TripInMemoryEntity {
    return trip.toPrimitives();
  }
}
