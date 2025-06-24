import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TripRepository } from 'src/trips/application/ports/trip.repository';
import { Trip } from 'src/trips/domain/trip';
import { TripsInMemoryMapper } from '../mapper/trips-in-memory.mapper';
import { TripInMemoryEntity } from '../entities/trip-in-memory.entity';

/**
 * In-memory implementation of the TripRepository interface.
 * Stores and manages trip data in memory using a Map data structure.
 */
@Injectable()
export class TripsInMemoryRepository implements TripRepository {
  private readonly logger = new Logger(TripsInMemoryRepository.name);
  private trips: Map<string, TripInMemoryEntity> = new Map<
    string,
    TripInMemoryEntity
  >();

  /**
   * Retrieves all trips stored in memory
   * @returns Promise resolving to an array of Trip domain objects
   */
  async findAll(): Promise<Trip[]> {
    const entities = Array.from(this.trips.values());
    return entities.map((entity) => TripsInMemoryMapper.toDomain(entity));
  }

  /**
   * Finds a trip by its ID
   * @param id - The ID of the trip to find
   * @returns Promise resolving to the found Trip domain object
   * @throws NotFoundException if trip with given ID is not found
   */
  public async findById(id: string): Promise<Trip> {
    this.logger.debug(`Finding trip with id: ${id}`);
    const entity = this.trips.get(id);
    if (!entity) {
      throw new NotFoundException(`Trip with id ${id} not found`);
    }
    return TripsInMemoryMapper.toDomain(entity);
  }

  /**
   * Saves a new trip in memory
   * @param trip - The Trip domain object to save
   * @returns Promise resolving to the saved Trip domain object
   */
  public async save(trip: Trip): Promise<Trip> {
    this.logger.debug(`Creating trip: ${JSON.stringify(trip)}`);
    const entity = TripsInMemoryMapper.toPersistence(trip);
    this.trips.set(trip.id, entity);
    return trip;
  }

  /**
   * Updates an existing trip in memory
   * @param trip - The Trip domain object with updated data
   * @returns Promise resolving to the updated Trip domain object
   */
  public async update(trip: Trip): Promise<Trip> {
    this.logger.debug(`Updating trip: ${JSON.stringify(trip)}`);
    const entity = TripsInMemoryMapper.toPersistence(trip);
    this.trips.set(trip.id, entity);
    return trip;
  }

  /**
   * Deletes a trip from memory
   * @param id - The ID of the trip to delete
   * @returns Promise resolving to the deleted Trip domain object
   * @throws NotFoundException if trip with given ID is not found
   */
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
