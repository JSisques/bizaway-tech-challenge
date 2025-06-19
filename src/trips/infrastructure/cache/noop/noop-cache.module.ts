import { Module } from '@nestjs/common';
import { TripCacheRepository } from 'src/trips/application/ports/trip-cache.repository';
import { NoopCacheTripRepository } from './repositories/trips-noop-cache.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: TripCacheRepository,
      useClass: NoopCacheTripRepository,
    },
  ],
  exports: [TripCacheRepository],
})
export class NoopCacheModule {}
