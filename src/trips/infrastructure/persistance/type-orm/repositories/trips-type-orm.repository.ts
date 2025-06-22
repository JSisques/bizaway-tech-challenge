import { Injectable, Logger } from '@nestjs/common';
import { TripTypeOrmEntity } from '../entities/trip-type-orm.entity';
import { TripRepository } from 'src/trips/application/ports/trip.repository';
import { Trip } from 'src/trips/domain/trip';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTripMapper } from '../mapper/trip-type-orm.mapper';

@Injectable()
export class TypeOrmTripsRepository implements TripRepository {
  private readonly logger = new Logger(TypeOrmTripsRepository.name);

  constructor(
    @InjectRepository(TripTypeOrmEntity)
    private readonly tripRepository: Repository<TripTypeOrmEntity>,
  ) {}

  public async findAll(): Promise<Trip[]> {
    this.logger.debug('Finding all trips');
    const trips = await this.tripRepository.find();
    return trips.map((trip) => TypeOrmTripMapper.toDomain(trip));
  }
  public async findById(id: string): Promise<Trip> {
    this.logger.debug(`Finding trip by id: ${id}`);
    const trip = await this.tripRepository.findOne({ where: { id } });
    return TypeOrmTripMapper.toDomain(trip);
  }
  public async save(trip: Trip): Promise<Trip> {
    this.logger.debug(`Saving trip: ${trip}`);
    const tripEntity = TypeOrmTripMapper.toPersistence(trip);
    const savedTrip = await this.tripRepository.save(tripEntity);
    return TypeOrmTripMapper.toDomain(savedTrip);
  }
  public async update(trip: Trip): Promise<Trip> {
    this.logger.debug(`Updating trip: ${trip}`);
    const tripEntity = TypeOrmTripMapper.toPersistence(trip);
    const updatedTrip = await this.tripRepository.save(tripEntity);
    return TypeOrmTripMapper.toDomain(updatedTrip);
  }
  public async delete(id: string): Promise<Trip> {
    this.logger.debug(`Deleting trip by id: ${id}`);
    const trip = await this.tripRepository.findOne({ where: { id } });
    await this.tripRepository.delete(trip);
    return TypeOrmTripMapper.toDomain(trip);
  }
}
