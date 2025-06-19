import { TripPlace } from './trip-place';
import { InvalidTripPlaceException } from '../exceptions/invalid-trip-place.exception';
import { SUPPORTED_PLACES } from 'src/common/constants/supported-places.constant';

describe('TripPlace Value Object', () => {
  describe('Creation', () => {
    it('should create with valid place', () => {
      const place = new TripPlace('SYD');
      expect(place.getValue()).toBe('SYD');
    });

    it('should throw exception for invalid place', () => {
      expect(() => new TripPlace('INVALID')).toThrow(InvalidTripPlaceException);
    });

    it('should accept all supported places', () => {
      Object.values(SUPPORTED_PLACES).forEach((placeCode) => {
        expect(() => new TripPlace(placeCode as string)).not.toThrow();
      });
    });
  });

  describe('Equality', () => {
    it('should be equal to same place', () => {
      const place1 = new TripPlace('SYD');
      const place2 = new TripPlace('SYD');
      expect(place1.equals(place2)).toBe(true);
    });

    it('should not be equal to different place', () => {
      const place1 = new TripPlace('SYD');
      const place2 = new TripPlace('GRU');
      expect(place1.equals(place2)).toBe(false);
    });
  });
});
