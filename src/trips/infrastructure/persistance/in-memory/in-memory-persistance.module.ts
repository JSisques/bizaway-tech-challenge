import { Module } from '@nestjs/common';
import { TripRepository } from 'src/trips/application/ports/trip.repository';
import { TripsInMemoryRepository } from './repositories/trips-in-memory.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: TripRepository,
      useClass: TripsInMemoryRepository,
    },
  ],
  exports: [TripRepository],
})
export class InMemoryPersistanceModule {}
