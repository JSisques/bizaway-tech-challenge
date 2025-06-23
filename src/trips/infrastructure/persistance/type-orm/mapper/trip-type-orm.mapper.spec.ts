import { Trip } from 'src/trips/domain/trip';
import { TripTypeOrmEntity } from '../entities/trip-type-orm.entity';
import { TypeOrmTripMapper } from './trip-type-orm.mapper';

describe('TypeOrmTripMapper', () => {
  const entity: TripTypeOrmEntity = {
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
    const result = TypeOrmTripMapper.toDomain(entity);
    expect(Trip.fromPrimitives).toHaveBeenCalledWith(entity);
    expect(result).toBe(trip);
  });

  it('toPersistence should call trip.toPrimitives', () => {
    trip.toPrimitives.mockReturnValue(entity);
    const result = TypeOrmTripMapper.toPersistence(trip);
    expect(trip.toPrimitives).toHaveBeenCalled();
    expect(result).toBe(entity);
  });
});
