import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotImplementedException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Trip } from 'src/trips/domain/trip';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripService } from 'src/trips/application/trip.service';
import { CreateTripCommand } from 'src/trips/application/commands/create-trip.command';
import { GetAllTripsQuery } from 'src/trips/application/queries/get-all-trips.query';
import { GetTripByIdQuery } from 'src/trips/application/queries/get-trip-by-id.query';
import { UpdateTripCommand } from 'src/trips/application/commands/update-trip.command';
import { DeleteTripCommand } from 'src/trips/application/commands/delete-trip.command';
import { DeleteTripDto } from './dto/delete-trip.dto';
import { SearchTripQuery } from 'src/trips/application/queries/search-trip.query';

//TODO: Implement piscina to work with threads

@Controller('trips')
export class TripController {
  private readonly logger = new Logger(TripController.name);

  constructor(private readonly tripService: TripService) {}

  @Get()
  async getAllTrips(): Promise<Trip[]> {
    this.logger.log('getAllTrips');
    return this.tripService.findAll(new GetAllTripsQuery());
  }
  @Get('search')
  async search(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('sort_by') sortBy: 'fastest' | 'cheapest',
  ): Promise<Trip[]> {
    this.logger.log(
      `Searching trips from ${origin} to ${destination}, sorted by ${sortBy}`,
    );
    return this.tripService.search(
      new SearchTripQuery(origin, destination, sortBy),
    );
  }

  @Get(':id')
  async getTripById(@Param('id', ParseUUIDPipe) id: string): Promise<Trip> {
    this.logger.log('getTripById');
    return this.tripService.findById(new GetTripByIdQuery(id));
  }

  @Post()
  async create(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    this.logger.log('create');
    return this.tripService.create(
      new CreateTripCommand({
        origin: createTripDto.origin,
        destination: createTripDto.destination,
        cost: createTripDto.cost,
        duration: createTripDto.duration,
        type: createTripDto.type,
      }),
    );
  }

  @Put()
  async update(@Body() updateTripDto: UpdateTripDto): Promise<Trip> {
    this.logger.log('update');
    return this.tripService.update(
      new UpdateTripCommand({
        ...updateTripDto,
      }),
    );
  }

  @Delete()
  async delete(@Body() deleteTripDto: DeleteTripDto): Promise<Trip> {
    this.logger.log('delete');
    return this.tripService.delete(new DeleteTripCommand(deleteTripDto.id));
  }
}
