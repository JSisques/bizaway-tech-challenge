import { Module } from '@nestjs/common';
import { TripCacheRepository } from 'src/trips/application/ports/trip-cache.repository';
import { TripRedisCacheRepository } from './repositories/trip-cache.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: TripCacheRepository,
      useClass: TripRedisCacheRepository,
    },
  ],
  exports: [TripCacheRepository],
})
export class RedisCacheModule {}
