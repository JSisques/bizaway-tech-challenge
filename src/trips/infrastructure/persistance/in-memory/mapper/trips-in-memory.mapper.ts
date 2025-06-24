import { Trip } from 'src/trips/domain/trip';
import { TripInMemoryEntity } from '../entities/trip-in-memory.entity';

/**
 * Mapper class responsible for converting between Trip domain objects and TripInMemoryEntity persistence objects.
 * Provides methods to transform objects between the domain and persistence layers.
 *
 * @class TripsInMemoryMapper
 */
export class TripsInMemoryMapper {
  /**
   * Converts a TripInMemoryEntity from the persistence layer to a Trip domain object.
   * Takes the raw entity data and creates a proper domain object.
   *
   * @static
   * @param {TripInMemoryEntity} entity - The TripInMemoryEntity to convert from persistence format
   * @returns {Trip} A Trip domain object containing the entity data
   * @memberof TripsInMemoryMapper
   */
  static toDomain(entity: TripInMemoryEntity): Trip {
    return Trip.fromPrimitives(entity);
  }

  /**
   * Converts a Trip domain object to a TripInMemoryEntity for persistence.
   * Takes a domain object and transforms it into the format needed for storage.
   *
   * @static
   * @param {Trip} trip - The Trip domain object to convert to persistence format
   * @returns {TripInMemoryEntity} A TripInMemoryEntity ready for persistence
   * @memberof TripsInMemoryMapper
   */
  static toPersistence(trip: Trip): TripInMemoryEntity {
    return trip.toPrimitives();
  }
}
