import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripTypeOrmEntity } from './entities/trip-type-orm.entity';
import { TripRepository } from 'src/trips/application/ports/trip.repository';
import { TypeOrmTripsRepository } from './repositories/trips-type-orm.repository';

@Module({
  // Here we are importing the entities that we want to use in the repository
  imports: [TypeOrmModule.forFeature([TripTypeOrmEntity])],
  providers: [
    {
      provide: TripRepository,
      useClass: TypeOrmTripsRepository,
    },
  ],
  exports: [TripRepository],
})
export class TypeOrmPersistanceModule {}
