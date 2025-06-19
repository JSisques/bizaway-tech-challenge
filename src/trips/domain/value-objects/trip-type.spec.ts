import { TripType } from './trip-type';

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
