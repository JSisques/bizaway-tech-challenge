import { TripsInMemoryCacheRepository } from './trips-in-memory-cache.repository';
import { Trip } from 'src/trips/domain/trip';
import { TripPlace } from 'src/trips/domain/value-objects/trip-place';
import { TripType } from 'src/trips/domain/value-objects/trip-type';
import { TripInMemoryCacheEntity } from '../entities/trip-in-memory-cache.entity';
import { TripInMemoryCacheMapper } from '../mapper/trip-in-memory-cache.mapper';

jest.mock('../mapper/trip-in-memory-cache.mapper');

describe('TripsInMemoryCacheRepository', () => {
  let repository: TripsInMemoryCacheRepository;

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
    }) as TripInMemoryCacheEntity;

  beforeEach(() => {
    repository = new TripsInMemoryCacheRepository();
    jest.clearAllMocks();
  });

  it('get should return null if not found', async () => {
    const result = await repository.get('not-exist');
    expect(result).toBeNull();
  });

  it('get should return the trip if found', async () => {
    const trip = createTrip('1');
    const entity = createEntity('1');
    (TripInMemoryCacheMapper.toPersistence as jest.Mock).mockReturnValue([
      entity,
    ]);
    (TripInMemoryCacheMapper.toDomain as jest.Mock).mockReturnValue(trip);
    await repository.set('key', trip);
    const result = await repository.get('key');
    expect(TripInMemoryCacheMapper.toDomain).toHaveBeenCalledWith(entity);
    expect(result).toBe(trip);
  });

  it('set should store the trip', async () => {
    const trip = createTrip('1');
    const entity = createEntity('1');
    (TripInMemoryCacheMapper.toPersistence as jest.Mock).mockReturnValue(
      entity,
    );
    await repository.set('key', trip);
    // No error esperado, comprobado en otros tests
  });

  it('setSearchQuery should store and return the array of trips', async () => {
    const trip1 = createTrip('1');
    const trip2 = createTrip('2');
    const entity1 = createEntity('1');
    const entity2 = createEntity('2');
    (TripInMemoryCacheMapper.toPersistence as jest.Mock)
      .mockReturnValueOnce(entity1)
      .mockReturnValueOnce(entity2);
    const result = await repository.setSearchQuery('key', [trip1, trip2]);
    expect(result).toEqual([trip1, trip2]);
  });

  it('getSearchQuery should return null if not found', async () => {
    const result = await repository.getSearchQuery('not-exist');
    expect(result).toBeNull();
  });

  it('getSearchQuery should return the array of trips if found', async () => {
    const trip1 = createTrip('1');
    const trip2 = createTrip('2');
    const entity1 = createEntity('1');
    const entity2 = createEntity('2');
    (TripInMemoryCacheMapper.toPersistence as jest.Mock)
      .mockReturnValueOnce(entity1)
      .mockReturnValueOnce(entity2);
    (TripInMemoryCacheMapper.toDomain as jest.Mock)
      .mockReturnValueOnce(trip1)
      .mockReturnValueOnce(trip2);
    await repository.setSearchQuery('key', [trip1, trip2]);
    const result = await repository.getSearchQuery('key');
    expect(result).toEqual([trip1, trip2]);
  });

  it('delete should remove the entry', async () => {
    const trip = createTrip('1');
    const entity = createEntity('1');
    (TripInMemoryCacheMapper.toPersistence as jest.Mock).mockReturnValue(
      entity,
    );
    await repository.set('key', trip);
    await repository.delete('key');
    const result = await repository.get('key');
    expect(result).toBeNull();
  });
});
