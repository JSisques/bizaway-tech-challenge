import { TypeOrmTripsRepository } from './trips-type-orm.repository';
import { Repository } from 'typeorm';
import { Trip } from 'src/trips/domain/trip';
import { TripPlace } from 'src/trips/domain/value-objects/trip-place';
import { TripType } from 'src/trips/domain/value-objects/trip-type';
import { TripTypeOrmEntity } from '../entities/trip-type-orm.entity';
import { TypeOrmTripMapper } from '../mapper/trip-type-orm.mapper';

jest.mock('../mapper/trip-type-orm.mapper');

describe('TypeOrmTripsRepository', () => {
  let repository: TypeOrmTripsRepository;
  let typeOrmRepo: jest.Mocked<Repository<TripTypeOrmEntity>>;

  // Utilidad para crear trips y entidades
  const createTrip = (
    id: string,
    origin = 'ATL',
    destination = 'PEK',
    cost = 100,
    duration = 60,
    type = 'flight',
  ) =>
    new Trip(
      id,
      new TripPlace(origin),
      new TripPlace(destination),
      cost,
      duration,
      new TripType(type),
    );
  const createEntity = (
    id: string,
    origin = 'ATL',
    destination = 'PEK',
    cost = 100,
    duration = 60,
    type = 'flight',
    displayName = '',
  ) =>
    ({
      id,
      origin,
      destination,
      cost,
      duration,
      type,
      displayName,
    }) as TripTypeOrmEntity;

  beforeEach(() => {
    typeOrmRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;
    repository = new TypeOrmTripsRepository(typeOrmRepo);
    jest.clearAllMocks();
  });

  it('should find all trips', async () => {
    const entity = createEntity('1');
    const trip = createTrip('1');
    typeOrmRepo.find.mockResolvedValue([entity]);
    (TypeOrmTripMapper.toDomain as jest.Mock).mockReturnValue(trip);
    const result = await repository.findAll();
    expect(typeOrmRepo.find).toHaveBeenCalled();
    expect(TypeOrmTripMapper.toDomain).toHaveBeenCalledWith(entity);
    expect(result).toEqual([trip]);
  });

  it('should find a trip by id', async () => {
    const entity = createEntity('1');
    const trip = createTrip('1');
    typeOrmRepo.findOne.mockResolvedValue(entity);
    (TypeOrmTripMapper.toDomain as jest.Mock).mockReturnValue(trip);
    const result = await repository.findById('1');
    expect(typeOrmRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(TypeOrmTripMapper.toDomain).toHaveBeenCalledWith(entity);
    expect(result).toBe(trip);
  });

  it('should save a trip', async () => {
    const trip = createTrip('1');
    const entity = createEntity('1');
    typeOrmRepo.save.mockResolvedValue(entity);
    (TypeOrmTripMapper.toPersistence as jest.Mock).mockReturnValue(entity);
    (TypeOrmTripMapper.toDomain as jest.Mock).mockReturnValue(trip);
    const result = await repository.save(trip);
    expect(TypeOrmTripMapper.toPersistence).toHaveBeenCalledWith(trip);
    expect(typeOrmRepo.save).toHaveBeenCalledWith(entity);
    expect(TypeOrmTripMapper.toDomain).toHaveBeenCalledWith(entity);
    expect(result).toBe(trip);
  });

  it('should update a trip', async () => {
    const trip = createTrip('1');
    const entity = createEntity('1');
    typeOrmRepo.save.mockResolvedValue(entity);
    (TypeOrmTripMapper.toPersistence as jest.Mock).mockReturnValue(entity);
    (TypeOrmTripMapper.toDomain as jest.Mock).mockReturnValue(trip);
    const result = await repository.update(trip);
    expect(TypeOrmTripMapper.toPersistence).toHaveBeenCalledWith(trip);
    expect(typeOrmRepo.save).toHaveBeenCalledWith(entity);
    expect(TypeOrmTripMapper.toDomain).toHaveBeenCalledWith(entity);
    expect(result).toBe(trip);
  });

  it('should delete a trip by id', async () => {
    const entity = createEntity('1');
    const trip = createTrip('1');
    typeOrmRepo.findOne.mockResolvedValue(entity);
    typeOrmRepo.delete.mockResolvedValue(undefined);
    (TypeOrmTripMapper.toDomain as jest.Mock).mockReturnValue(trip);
    const result = await repository.delete('1');
    expect(typeOrmRepo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(typeOrmRepo.delete).toHaveBeenCalledWith(entity);
    expect(TypeOrmTripMapper.toDomain).toHaveBeenCalledWith(entity);
    expect(result).toBe(trip);
  });

  it('should return undefined if trip not found on delete', async () => {
    typeOrmRepo.findOne.mockResolvedValue(undefined);
    (TypeOrmTripMapper.toDomain as jest.Mock).mockImplementation((entity) => {
      if (!entity) return undefined;
    });
    const result = await repository.delete('not-exist');
    expect(result).toBeUndefined();
  });
});
