import { Trip } from 'src/trips/domain/trip';
import { TripTypeOrmEntity } from '../entities/trip-type-orm.entity';

export class TypeOrmTripMapper {
  static toDomain(tripEntity: TripTypeOrmEntity): Trip {
    return Trip.fromPrimitives(tripEntity);
  }

  static toPersistence(trip: Trip): TripTypeOrmEntity {
    return trip.toPrimitives();
  }
}
