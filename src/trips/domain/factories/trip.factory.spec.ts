import { TripFactory } from './trip.factory';
import { Trip } from '../trip';
import { TripPlace } from '../value-objects/trip-place';
import { TripType } from '../value-objects/trip-type';
import { InvalidTripPlaceException } from '../exceptions/invalid-trip-place.exception';
import { SUPPORTED_PLACES } from 'src/common/constants/supported-places.constant';

describe('TripFactory', () => {
  let factory: TripFactory;

  beforeEach(() => {
    factory = new TripFactory();
  });

  it('should create a Trip with valid data', () => {
    const origin = 'SYD';
    const destination = 'GRU';
    const cost = 100;
    const duration = 5;
    const type = 'flight';

    const trip = factory.create(origin, destination, cost, duration, type);

    expect(trip).toBeInstanceOf(Trip);
    expect(trip.origin).toBeInstanceOf(TripPlace);
    expect(trip.destination).toBeInstanceOf(TripPlace);
    expect(trip.type).toBeInstanceOf(TripType);
    expect(typeof trip.id).toBe('string');
    expect(trip.origin.getValue()).toBe(origin);
    expect(trip.destination.getValue()).toBe(destination);
    expect(trip.cost).toBe(cost);
    expect(trip.duration).toBe(duration);
    expect(trip.type.getValue()).toBe(type);
    expect(trip.displayName).toBe(
      `from ${origin} to ${destination} by ${type}`,
    );
  });

  it('should generate a unique id for each trip', () => {
    const trip1 = factory.create('SYD', 'GRU', 100, 5, 'flight');
    const trip2 = factory.create('SYD', 'GRU', 100, 5, 'flight');
    expect(trip1.id).not.toBe(trip2.id);
  });

  it('should throw InvalidTripPlaceException for unsupported origin', () => {
    expect(() => factory.create('XXX', 'GRU', 100, 5, 'flight')).toThrow(
      InvalidTripPlaceException,
    );
  });

  it('should throw InvalidTripPlaceException for unsupported destination', () => {
    expect(() => factory.create('SYD', 'XXX', 100, 5, 'flight')).toThrow(
      InvalidTripPlaceException,
    );
  });

  it('should accept all supported places as origin and destination', () => {
    const supportedPlaceCodes = Object.keys(SUPPORTED_PLACES).filter((key) =>
      isNaN(Number(key)),
    );

    for (let i = 0; i < supportedPlaceCodes.length - 1; i++) {
      const origin = supportedPlaceCodes[i];
      const destination = supportedPlaceCodes[i + 1];
      expect(() =>
        factory.create(origin, destination, 100, 5, 'flight'),
      ).not.toThrow();
    }
  });

  it('should create a Trip with different types', () => {
    const types = ['flight', 'train', 'car'];
    types.forEach((type) => {
      const trip = factory.create('SYD', 'GRU', 100, 5, type);
      expect(trip.type.getValue()).toBe(type);
    });
  });

  it('should produce correct primitive values', () => {
    const trip = factory.create('SYD', 'GRU', 100, 5, 'flight');
    const primitives = trip.toPrimitives();
    expect(primitives.origin).toBe('SYD');
    expect(primitives.destination).toBe('GRU');
    expect(primitives.cost).toBe(100);
    expect(primitives.duration).toBe(5);
    expect(primitives.type).toBe('flight');
    expect(primitives.displayName).toBe('from SYD to GRU by flight');
    expect(typeof primitives.id).toBe('string');
  });
});
