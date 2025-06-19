import { Module } from '@nestjs/common';
import { TripController } from './http/trips.controller';
import { TripResolver } from './graphql/trips.resolver';

@Module({
  controllers: [TripController],
  providers: [TripResolver],
})
export class TripsPresentersModule {}
