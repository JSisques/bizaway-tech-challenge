import { TripType } from './trip-type';
import { InvalidTripTypeException } from '../exceptions/invalid-trip-type.exception';

describe('TripType Value Object', () => {
  describe('Creation', () => {
    it('should create with flight type', () => {
      const type = new TripType('flight');
      expect(type.getValue()).toBe('flight');
    });

    it('should create with train type', () => {
      const type = new TripType('train');
      expect(type.getValue()).toBe('train');
    });

    it('should create with car type', () => {
      const type = new TripType('car');
      expect(type.getValue()).toBe('car');
    });

    it('should throw error when type is not a string', () => {
      expect(() => new TripType(123 as any)).toThrow(InvalidTripTypeException);
      expect(() => new TripType(null as any)).toThrow(InvalidTripTypeException);
      expect(() => new TripType(undefined as any)).toThrow(
        InvalidTripTypeException,
      );
    });

    it('should trim whitespace from type', () => {
      const type = new TripType('  flight  ');
      expect(type.getValue()).toBe('flight');
    });

    it('should convert type to lowercase', () => {
      const type = new TripType('FLIGHT');
      expect(type.getValue()).toBe('flight');
    });
  });

  describe('Equality', () => {
    it('should be equal to same type', () => {
      const type1 = new TripType('FLIGHT');
      const type2 = new TripType('FLIGHT');
      expect(type1.equals(type2)).toBe(true);
    });

    it('should not be equal to different type', () => {
      const type1 = new TripType('flight');
      const type2 = new TripType('train');
      expect(type1.equals(type2)).toBe(false);
    });

    it('should be equal despite different casing', () => {
      const type1 = new TripType('FLIGHT');
      const type2 = new TripType('flight');
      expect(type1.equals(type2)).toBe(true);
    });

    it('should be equal despite extra whitespace', () => {
      const type1 = new TripType('flight');
      const type2 = new TripType('  flight  ');
      expect(type1.equals(type2)).toBe(true);
    });
  });

  describe('Value access', () => {
    it('should return the correct value for flight', () => {
      const type = new TripType('flight');
      expect(type.getValue()).toBe('flight');
    });

    it('should return the correct value for train', () => {
      const type = new TripType('train');
      expect(type.getValue()).toBe('train');
    });

    it('should return the correct value for car', () => {
      const type = new TripType('car');
      expect(type.getValue()).toBe('car');
    });
  });
});
