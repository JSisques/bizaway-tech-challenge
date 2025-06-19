import { Trip } from 'src/trips/domain/trip';
import { SearchTripQuery } from '../queries/search-trip.query';

export abstract class TripRepository {
  public abstract findAll(): Promise<Trip[]>;
  public abstract findById(id: string): Promise<Trip>;
  public abstract save(trip: Trip): Promise<Trip>;
  public abstract update(trip: Trip): Promise<Trip>;
  public abstract delete(id: string): Promise<Trip>;
}
