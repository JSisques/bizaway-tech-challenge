import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TripRepository } from 'src/trips/application/ports/trip.repository';
import { SearchTripQuery } from 'src/trips/application/queries/search-trip.query';
import { Trip } from 'src/trips/domain/trip';
import { TripsInMemoryMapper } from '../mapper/trips-in-memory.mapper';
import { TripInMemoryEntity } from '../entities/trip-in-memory.entity';

@Injectable()
export class TripsInMemoryRepository implements TripRepository {
  private readonly logger = new Logger(TripsInMemoryRepository.name);
  private trips: Map<string, TripInMemoryEntity> = new Map<
    string,
    TripInMemoryEntity
  >();

  async findAll(): Promise<Trip[]> {
    const entities = Array.from(this.trips.values());
    return entities.map((entity) => TripsInMemoryMapper.toDomain(entity));
  }

  public async findById(id: string): Promise<Trip> {
    this.logger.debug(`Finding trip with id: ${id}`);
    const entity = this.trips.get(id);
    if (!entity) {
      throw new NotFoundException(`Trip with id ${id} not found`);
    }
    return TripsInMemoryMapper.toDomain(entity);
  }

  public async save(trip: Trip): Promise<Trip> {
    this.logger.debug(`Creating trip: ${JSON.stringify(trip)}`);
    const entity = TripsInMemoryMapper.toPersistence(trip);
    this.trips.set(trip.id, entity);
    return trip;
  }
  public async update(trip: Trip): Promise<Trip> {
    this.logger.debug(`Updating trip: ${JSON.stringify(trip)}`);
    const entity = TripsInMemoryMapper.toPersistence(trip);
    this.trips.set(trip.id, entity);
    return trip;
  }
  public async delete(id: string): Promise<Trip> {
    this.logger.debug(`Deleting trip with id: ${id}`);
    const trip = this.trips.get(id);
    if (!trip) {
      throw new NotFoundException(`Trip with id ${id} not found`);
    }
    this.trips.delete(id);
    return TripsInMemoryMapper.toDomain(trip);
  }
}
