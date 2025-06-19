import { DynamicModule, Module, Type } from '@nestjs/common';
import { SearchQueryHandler } from './queries/search-trip.query-handler';
import { TripFactory } from '../domain/factories/trip.factory';
import { TripService } from './trip.service';
import { TripController } from '../presenters/http/trips.controller';
import { CreateTripCommandHandler } from './commands/create-trip.command-handler';
import { UpdateTripCommandHandler } from './commands/update-trip.command-handler';
import { DeleteTripCommandHandler } from './commands/delete-trip.command-handler';
import { GetAllTripsQueryHandler } from './queries/get-all-trips.query-handler';
import { GetTripByIdQueryHandler } from './queries/get-trip-by-id.query-handler copy';
import { HttpModule } from '@nestjs/axios';
import { TripsDomainModule } from '../domain/trips-domain.module';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TripsDomainModule,
  ],
  controllers: [TripController],
  providers: [
    TripService,
    CreateTripCommandHandler,
    UpdateTripCommandHandler,
    DeleteTripCommandHandler,
    GetAllTripsQueryHandler,
    GetTripByIdQueryHandler,
    SearchQueryHandler,
  ],
})
export class TripsApplicationModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: TripsApplicationModule,
      imports: [infrastructureModule],
    };
  }
}
