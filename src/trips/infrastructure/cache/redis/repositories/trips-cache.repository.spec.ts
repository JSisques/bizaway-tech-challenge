import { TripRedisCacheRepository } from './trips-cache.repository';
import { Trip } from 'src/trips/domain/trip';
import { TripPlace } from 'src/trips/domain/value-objects/trip-place';
import { TripType } from 'src/trips/domain/value-objects/trip-type';
import { TripRedisCacheEntity } from '../entities/trip-cache.entity';
import { TripRedisCacheMapper } from '../mapper/trip-cache.mapper';

jest.mock('../mapper/trip-cache.mapper');

describe('TripRedisCacheRepository', () => {
  let repository: TripRedisCacheRepository;
  let redisClient: any;
  const OLD_ENV = process.env;

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
    }) as TripRedisCacheEntity;

  beforeEach(() => {
    redisClient = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };
    process.env = { ...OLD_ENV, REDIS_TTL: '3600' };
    repository = new TripRedisCacheRepository(redisClient);
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('get should return null if not found', async () => {
    redisClient.get.mockResolvedValue(null);
    const result = await repository.get('not-exist');
    expect(result).toBeNull();
  });

  it('get should return the trip if found', async () => {
    const trip = createTrip('1');
    const entity = createEntity('1');
    redisClient.get.mockResolvedValue(JSON.stringify(entity));
    (TripRedisCacheMapper.toDomain as jest.Mock).mockReturnValue(trip);
    const result = await repository.get('key');
    expect(redisClient.get).toHaveBeenCalledWith('key');
    expect(TripRedisCacheMapper.toDomain).toHaveBeenCalledWith(entity);
    expect(result).toBe(trip);
  });

  it('set should store the trip in redis', async () => {
    const trip = createTrip('1');
    await repository.set('key', trip);
    expect(redisClient.set).toHaveBeenCalledWith(
      'key',
      JSON.stringify(trip),
      'EX',
      3600,
    );
  });

  it('setSearchQuery should store and return the array of trips', async () => {
    const trip1 = createTrip('1');
    const trip2 = createTrip('2');
    const entity1 = createEntity('1');
    const entity2 = createEntity('2');
    (TripRedisCacheMapper.toPersistence as jest.Mock)
      .mockReturnValueOnce(entity1)
      .mockReturnValueOnce(entity2);
    const result = await repository.setSearchQuery('key', [trip1, trip2]);
    expect(redisClient.set).toHaveBeenCalledWith(
      'key',
      JSON.stringify([entity1, entity2]),
      'EX',
      3600,
    );
    expect(result).toEqual([trip1, trip2]);
  });

  it('getSearchQuery should return null if not found', async () => {
    redisClient.get.mockResolvedValue(null);
    const result = await repository.getSearchQuery('not-exist');
    expect(result).toBeNull();
  });

  it('getSearchQuery should return the array of trips if found', async () => {
    const trip1 = createTrip('1');
    const trip2 = createTrip('2');
    const entity1 = createEntity('1');
    const entity2 = createEntity('2');
    redisClient.get.mockResolvedValue(JSON.stringify([entity1, entity2]));
    (TripRedisCacheMapper.toDomain as jest.Mock)
      .mockReturnValueOnce(trip1)
      .mockReturnValueOnce(trip2);
    const result = await repository.getSearchQuery('key');
    expect(redisClient.get).toHaveBeenCalledWith('key');
    expect(result).toEqual([trip1, trip2]);
  });

  it('delete should remove the entry from redis', async () => {
    await repository.delete('key');
    expect(redisClient.del).toHaveBeenCalledWith('key');
  });
});
