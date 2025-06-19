import { Module } from '@nestjs/common';
import { TripSortingService } from './services/trip-sorting.service';
import { TripFactory } from './factories/trip.factory';

@Module({
  providers: [TripFactory, TripSortingService],
  exports: [TripFactory, TripSortingService],
})
export class TripsDomainModule {}
