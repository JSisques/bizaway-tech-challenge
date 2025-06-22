import { Trip } from 'src/trips/domain/trip';

export abstract class TripRepository {
  public abstract findAll(): Promise<Trip[]>;
  public abstract findById(id: string): Promise<Trip>;
  public abstract save(trip: Trip): Promise<Trip>;
  public abstract update(trip: Trip): Promise<Trip>;
  public abstract delete(id: string): Promise<Trip>;
}
