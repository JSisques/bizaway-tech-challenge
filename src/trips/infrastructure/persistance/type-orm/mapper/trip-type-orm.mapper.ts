import { Trip } from 'src/trips/domain/trip';
import { TripTypeOrmEntity } from '../entities/trip-type-orm.entity';

/**
 * Mapper class to convert between Trip domain objects and TypeORM entities
 */
export class TypeOrmTripMapper {
  /**
   * Converts a TypeORM trip entity to a domain Trip object
   * @param tripEntity - The TypeORM entity to convert
   * @returns A Trip domain object
   */
  static toDomain(tripEntity: TripTypeOrmEntity): Trip {
    return Trip.fromPrimitives(tripEntity);
  }

  /**
   * Converts a Trip domain object to a TypeORM entity
   * @param trip - The Trip domain object to convert
   * @returns A TypeORM trip entity
   */
  static toPersistence(trip: Trip): TripTypeOrmEntity {
    return trip.toPrimitives();
  }
}
