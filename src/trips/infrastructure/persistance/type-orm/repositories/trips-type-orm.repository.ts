import { Injectable, Logger } from '@nestjs/common';
import { TripTypeOrmEntity } from '../entities/trip-type-orm.entity';
import { TripRepository } from 'src/trips/application/ports/trip.repository';
import { Trip } from 'src/trips/domain/trip';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTripMapper } from '../mapper/trip-type-orm.mapper';

/**
 * TypeORM implementation of the TripRepository interface.
 * Handles persistence of trip data in a relational database using TypeORM.
 */
@Injectable()
export class TypeOrmTripsRepository implements TripRepository {
  private readonly logger = new Logger(TypeOrmTripsRepository.name);

  /**
   * Creates an instance of TypeOrmTripsRepository.
   * @param tripRepository - The TypeORM repository for trip entities
   */
  constructor(
    @InjectRepository(TripTypeOrmEntity)
    private readonly tripRepository: Repository<TripTypeOrmEntity>,
  ) {}

  /**
   * Retrieves all trips from the database
   * @returns Promise resolving to an array of Trip domain objects
   */
  public async findAll(): Promise<Trip[]> {
    this.logger.debug('Finding all trips');
    const trips = await this.tripRepository.find();
    return trips.map((trip) => TypeOrmTripMapper.toDomain(trip));
  }

  /**
   * Finds a trip by its ID
   * @param id - The ID of the trip to find
   * @returns Promise resolving to the found Trip domain object
   */
  public async findById(id: string): Promise<Trip> {
    this.logger.debug(`Finding trip by id: ${id}`);
    const trip = await this.tripRepository.findOne({ where: { id } });
    return TypeOrmTripMapper.toDomain(trip);
  }

  /**
   * Saves a new trip to the database
   * @param trip - The Trip domain object to save
   * @returns Promise resolving to the saved Trip domain object
   */
  public async save(trip: Trip): Promise<Trip> {
    this.logger.debug(`Saving trip: ${trip}`);
    const tripEntity = TypeOrmTripMapper.toPersistence(trip);
    const savedTrip = await this.tripRepository.save(tripEntity);
    return TypeOrmTripMapper.toDomain(savedTrip);
  }

  /**
   * Updates an existing trip in the database
   * @param trip - The Trip domain object with updated data
   * @returns Promise resolving to the updated Trip domain object
   */
  public async update(trip: Trip): Promise<Trip> {
    this.logger.debug(`Updating trip: ${trip}`);
    const tripEntity = TypeOrmTripMapper.toPersistence(trip);
    const updatedTrip = await this.tripRepository.save(tripEntity);
    return TypeOrmTripMapper.toDomain(updatedTrip);
  }

  /**
   * Deletes a trip from the database
   * @param id - The ID of the trip to delete
   * @returns Promise resolving to the deleted Trip domain object
   */
  public async delete(id: string): Promise<Trip> {
    this.logger.debug(`Deleting trip by id: ${id}`);
    const trip = await this.tripRepository.findOne({ where: { id } });
    await this.tripRepository.delete(trip);
    return TypeOrmTripMapper.toDomain(trip);
  }
}
