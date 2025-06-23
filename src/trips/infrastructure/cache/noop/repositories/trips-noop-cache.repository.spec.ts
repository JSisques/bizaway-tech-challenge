import { NoopCacheTripRepository } from './trips-noop-cache.repository';
import { Trip } from 'src/trips/domain/trip';
import { TripPlace } from 'src/trips/domain/value-objects/trip-place';
import { TripType } from 'src/trips/domain/value-objects/trip-type';

describe('NoopCacheTripRepository', () => {
  let repository: NoopCacheTripRepository;

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

  beforeEach(() => {
    repository = new NoopCacheTripRepository();
  });

  it('get should always return null', async () => {
    const result = await repository.get('any-key');
    expect(result).toBeNull();
  });

  it('getSearchQuery should always return null', async () => {
    const result = await repository.getSearchQuery('any-key');
    expect(result).toBeNull();
  });

  it('set should not throw and return void', async () => {
    await expect(
      repository.set('any-key', createTrip('1')),
    ).resolves.toBeUndefined();
  });

  it('delete should not throw and return void', async () => {
    await expect(repository.delete('any-key')).resolves.toBeUndefined();
  });

  it('setSearchQuery should return the same array of trips', async () => {
    const trips = [createTrip('1'), createTrip('2')];
    const result = await repository.setSearchQuery('any-key', trips);
    expect(result).toBe(trips);
  });
});
