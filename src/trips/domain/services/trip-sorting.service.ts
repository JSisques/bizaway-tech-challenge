import { Injectable } from '@nestjs/common';
import { Trip } from '../trip';
import { InvalidSortingStrategyException } from '../exceptions/invalid-sorting-strategy.exception';

/**
 * Defines the available sorting strategies for trips
 */
export type SortStrategy = 'fastest' | 'cheapest';

/**
 * Service responsible for sorting trips based on different criteria
 */
@Injectable()
export class TripSortingService {
  /**
   * Sorts trips according to the specified strategy
   * @param trips - Array of trips to sort
   * @param strategy - Sorting strategy ('fastest' or 'cheapest')
   * @returns Sorted array of trips
   * @throws {InvalidSortingStrategyException} If an invalid sorting strategy is provided
   */
  public sortTrips(trips: Trip[], strategy: SortStrategy): Trip[] {
    return [...trips].sort((a, b) => {
      switch (strategy) {
        case 'fastest':
          return a.duration - b.duration;
        case 'cheapest':
          return a.cost - b.cost;
        default:
          throw new InvalidSortingStrategyException(strategy);
      }
    });
  }

  /**
   * Sorts trips by fastest first (shortest duration)
   * @param trips - Array of trips to sort
   * @returns Sorted array of trips by duration in ascending order
   * @see {@link sortTrips}
   */
  public sortByFastest(trips: Trip[]): Trip[] {
    return this.sortTrips(trips, 'fastest');
  }

  /**
   * Sorts trips by cheapest first (lowest cost)
   * @param trips - Array of trips to sort
   * @returns Sorted array of trips by cost in ascending order
   * @see {@link sortTrips}
   */
  public sortByCheapest(trips: Trip[]): Trip[] {
    return this.sortTrips(trips, 'cheapest');
  }
}
