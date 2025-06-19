import { randomUUID } from 'crypto';
import { Trip } from './trip';
import { TripPlace } from './value-objects/trip-place';
import { TripType } from './value-objects/trip-type';

describe('Trip Domain Entity', () => {
  const validTripData = {
    id: randomUUID(),
    origin: 'SYD',
    destination: 'GRU',
    cost: 500,
    duration: 5,
    type: 'flight',
  };

  describe('Creation', () => {
    it('should create a trip with valid data', () => {
      const trip = new Trip(
        validTripData.id,
        new TripPlace(validTripData.origin),
        new TripPlace(validTripData.destination),
        validTripData.cost,
        validTripData.duration,
        new TripType(validTripData.type),
      );

      expect(trip.id).toBe(validTripData.id);
      expect(trip.origin.getValue()).toBe(validTripData.origin);
      expect(trip.destination.getValue()).toBe(validTripData.destination);
      expect(trip.cost).toBe(validTripData.cost);
      expect(trip.duration).toBe(validTripData.duration);
      expect(trip.type.getValue()).toBe(validTripData.type);
    });

    it('should generate display name correctly', () => {
      const trip = new Trip(
        validTripData.id,
        new TripPlace(validTripData.origin),
        new TripPlace(validTripData.destination),
        validTripData.cost,
        validTripData.duration,
        new TripType(validTripData.type),
      );

      expect(trip.displayName).toBe('from SYD to GRU by flight');
    });
  });

  describe('Primitives Conversion', () => {
    it('should convert to primitives correctly', () => {
      const trip = new Trip(
        validTripData.id,
        new TripPlace(validTripData.origin),
        new TripPlace(validTripData.destination),
        validTripData.cost,
        validTripData.duration,
        new TripType(validTripData.type),
      );

      const primitives = trip.toPrimitives();

      expect(primitives).toEqual({
        id: validTripData.id,
        origin: validTripData.origin,
        destination: validTripData.destination,
        cost: validTripData.cost,
        duration: validTripData.duration,
        type: validTripData.type,
        displayName: 'from SYD to GRU by flight',
      });
    });

    it('should create from primitives correctly', () => {
      const primitives = {
        id: validTripData.id,
        origin: validTripData.origin,
        destination: validTripData.destination,
        cost: validTripData.cost,
        duration: validTripData.duration,
        type: validTripData.type,
        displayName: 'from SYD to GRU by flight',
      };

      const trip = Trip.fromPrimitives(primitives);

      expect(trip.id).toBe(validTripData.id);
      expect(trip.origin.getValue()).toBe(validTripData.origin);
      expect(trip.destination.getValue()).toBe(validTripData.destination);
    });
  });
});
