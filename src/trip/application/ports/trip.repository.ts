import { Trip } from 'src/trip/domain/trip';

export abstract class TripRepository {
  public abstract findAll(): Promise<Trip[]>;
  public abstract findById(id: string): Promise<Trip>;
  public abstract create(trip: Trip): Promise<Trip>;
  public abstract update(trip: Trip): Promise<Trip>;
  public abstract delete(id: string): Promise<Trip>;
}
