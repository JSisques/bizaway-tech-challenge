import { Trip } from 'src/trips/domain/trip';
import { TripInMemoryCacheEntity } from '../entities/trip-in-memory-cache.entity';
import { TripInMemoryCacheMapper } from './trip-in-memory-cache.mapper';

describe('TripInMemoryCacheMapper', () => {
  const entity: TripInMemoryCacheEntity = {
    id: '1',
    origin: 'ATL',
    destination: 'PEK',
    cost: 100,
    duration: 60,
    type: 'flight',
    displayName: 'from ATL to PEK by flight',
  };
  const trip = { toPrimitives: jest.fn() } as any;

  beforeEach(() => {
    jest.spyOn(Trip, 'fromPrimitives').mockReturnValue(trip);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('toDomain should call Trip.fromPrimitives with entity', () => {
    const result = TripInMemoryCacheMapper.toDomain(entity);
    expect(Trip.fromPrimitives).toHaveBeenCalledWith(entity);
    expect(result).toBe(trip);
  });

  it('toPersistence should call trip.toPrimitives', () => {
    trip.toPrimitives.mockReturnValue(entity);
    const result = TripInMemoryCacheMapper.toPersistence(trip);
    expect(trip.toPrimitives).toHaveBeenCalled();
    expect(result).toBe(entity);
  });
});
