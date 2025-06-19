import { Module } from '@nestjs/common';
import { TripRepository } from './ports/trip.repository';
import { GetAllTripsQueryHandler } from './queries/get-all-trips.query-handler';
import { GetTripByIdQueryHandler } from './queries/get-trip-by-id.query-handler copy';
import { SearchQueryHandler } from './queries/search-trip.query-handler';
import { CreateTripCommandHandler } from './commands/create-trip.command-handler';
import { DeleteTripCommandHandler } from './commands/delete-trip.command-handler';
import { UpdateTripCommandHandler } from './commands/update-trip.command-handler';

@Module({
  providers: [
    CreateTripCommandHandler,
    UpdateTripCommandHandler,
    DeleteTripCommandHandler,
    GetAllTripsQueryHandler,
    GetTripByIdQueryHandler,
    SearchQueryHandler,
  ],
})
export class TripsApplicationModule {}
