import { Module } from '@nestjs/common';
import { TripCacheRepository } from 'src/trips/application/ports/trip-cache.repository';
import { TripsInMemoryCacheRepository } from './repositories/trips-in-memory-cache.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: TripCacheRepository,
      useClass: TripsInMemoryCacheRepository,
    },
  ],
  exports: [TripCacheRepository],
})
export class InMemoryCacheModule {}
