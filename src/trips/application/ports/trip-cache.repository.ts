import { Trip } from 'src/trips/domain/trip';

export abstract class TripCacheRepository {
  abstract getTripById(id: string): Promise<Trip | null>;
  abstract setTrip(trip: Trip): Promise<void>;
  abstract deleteTrip(id: string): Promise<void>;
}
