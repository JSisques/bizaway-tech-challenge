import { TripsInMemoryRepository } from './trips-in-memory.repository';
import { Trip } from 'src/trips/domain/trip';
import { TripPlace } from 'src/trips/domain/value-objects/trip-place';
import { TripType } from 'src/trips/domain/value-objects/trip-type';
import { NotFoundException } from '@nestjs/common';

// Utilidades para crear trips válidos
const createTrip = (
  id: string,
  origin = 'ATL',
  destination = 'PEK',
  cost = 100,
  duration = 60,
  type = 'flight',
) => {
  return new Trip(
    id,
    new TripPlace(origin),
    new TripPlace(destination),
    cost,
    duration,
    new TripType(type),
  );
};

describe('TripsInMemoryRepository', () => {
  let repository: TripsInMemoryRepository;

  beforeEach(() => {
    repository = new TripsInMemoryRepository();
  });

  it('should save and find a trip by id', async () => {
    const trip = createTrip('1');
    await repository.save(trip);
    const found = await repository.findById('1');
    expect(found).toBeInstanceOf(Trip);
    expect(found.id).toBe('1');
  });

  it('should return all trips with findAll', async () => {
    const trip1 = createTrip('1');
    const trip2 = createTrip('2', 'PEK', 'LAX');
    await repository.save(trip1);
    await repository.save(trip2);
    const all = await repository.findAll();
    expect(all).toHaveLength(2);
    expect(all.map((t) => t.id)).toEqual(expect.arrayContaining(['1', '2']));
  });

  it('should throw NotFoundException if trip does not exist (findById)', async () => {
    await expect(repository.findById('not-exist')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a trip', async () => {
    const trip = createTrip('1');
    await repository.save(trip);
    const updated = createTrip('1', 'ATL', 'LAX', 200, 120, 'bus');
    await repository.update(updated);
    const found = await repository.findById('1');
    expect(found.destination.getValue()).toBe('LAX');
    expect(found.cost).toBe(200);
    expect(found.duration).toBe(120);
    expect(found.type.getValue()).toBe('bus');
  });

  it('should delete a trip by id', async () => {
    const trip = createTrip('1');
    await repository.save(trip);
    const deleted = await repository.delete('1');
    expect(deleted.id).toBe('1');
    await expect(repository.findById('1')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when deleting a non-existent trip', async () => {
    await expect(repository.delete('not-exist')).rejects.toThrow(
      NotFoundException,
    );
  });
});
