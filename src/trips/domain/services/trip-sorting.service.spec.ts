import { Test, TestingModule } from '@nestjs/testing';
import { TripSortingService, SortStrategy } from './trip-sorting.service';
import { Trip } from '../trip';
import { TripPlace } from '../value-objects/trip-place';
import { TripType } from '../value-objects/trip-type';
import { Logger } from '@nestjs/common';
import { InvalidSortingStrategyException } from '../exceptions/invalid-sorting-strategy.exception';
import { randomUUID } from 'crypto';

describe('TripSortingService', () => {
  let service: TripSortingService;

  const createTrip = (cost: number, duration: number): Trip => {
    return new Trip(
      randomUUID(),
      new TripPlace('SYD'),
      new TripPlace('GRU'),
      cost,
      duration,
      new TripType('flight'),
    );
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripSortingService,
        {
          provide: Logger,
          useValue: {
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TripSortingService>(TripSortingService);
  });

  describe('sortTrips', () => {
    it('should sort by fastest correctly', () => {
      const trips = [
        createTrip(100, 5), // More slow
        createTrip(200, 2), // More fast
        createTrip(150, 3), // Medium
      ];

      const result = service.sortTrips(trips, 'fastest');

      expect(result[0].duration).toBe(2);
      expect(result[1].duration).toBe(3);
      expect(result[2].duration).toBe(5);
    });

    it('should sort by cheapest correctly', () => {
      const trips = [
        createTrip(200, 2), // More expensive
        createTrip(100, 5), // Cheaper
        createTrip(150, 3), // Medium
      ];

      const result = service.sortTrips(trips, 'cheapest');

      expect(result[0].cost).toBe(100);
      expect(result[1].cost).toBe(150);
      expect(result[2].cost).toBe(200);
    });

    it('should not mutate original array', () => {
      const trips = [createTrip(200, 2), createTrip(100, 5)];

      const originalTrips = [...trips];
      service.sortTrips(trips, 'cheapest');

      expect(trips).toEqual(originalTrips);
    });

    it('should throw exception for invalid strategy', () => {
      const trips = [createTrip(100, 5)];

      expect(() => service.sortTrips(trips, 'invalid' as SortStrategy)).toThrow(
        InvalidSortingStrategyException,
      );
    });
  });

  describe('sortByFastest', () => {
    it('should sort by duration ascending', () => {
      const trips = [
        createTrip(100, 5),
        createTrip(200, 2),
        createTrip(150, 3),
      ];

      const result = service.sortByFastest(trips);

      expect(result.map((t) => t.duration)).toEqual([2, 3, 5]);
    });
  });

  describe('sortByCheapest', () => {
    it('should sort by cost ascending', () => {
      const trips = [
        createTrip(200, 2),
        createTrip(100, 5),
        createTrip(150, 3),
      ];

      const result = service.sortByCheapest(trips);

      expect(result.map((t) => t.cost)).toEqual([100, 150, 200]);
    });
  });
});
