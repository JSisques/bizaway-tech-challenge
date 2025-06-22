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
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripService } from 'src/trips/application/trip.service';
import { SaveTripCommand } from 'src/trips/application/commands/save-trip.command';
import { GetAllTripsQuery } from 'src/trips/application/queries/get-all-trips.query';
import { GetTripByIdQuery } from 'src/trips/application/queries/get-trip-by-id.query';
import { UpdateTripCommand } from 'src/trips/application/commands/update-trip.command';
import { DeleteTripCommand } from 'src/trips/application/commands/delete-trip.command';
import { DeleteTripDto } from './dto/delete-trip.dto';
import { SearchTripQuery } from 'src/trips/application/queries/search-trip.query';
import { SaveTripDto } from './dto/save-trip.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TripResponseDto } from './dto/trip-response.dto';

//TODO: Implement piscina to work with threads

@ApiTags('trips')
@Controller('trips')
export class TripController {
  private readonly logger = new Logger(TripController.name);

  constructor(private readonly tripService: TripService) {}

  @ApiOperation({
    summary: 'Get all saved trips',
    description:
      'Retrieves a list of all trips that have been saved in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all saved trips.',
    type: [TripResponseDto],
  })
  @Get()
  async getAllTrips(): Promise<TripResponseDto[]> {
    this.logger.log('getAllTrips');
    const trips = await this.tripService.findAll(new GetAllTripsQuery());
    return trips.map((trip) => trip.toPrimitives());
  }

  @ApiOperation({
    summary: 'Search for trips',
    description:
      'Searches for trips based on an origin, a destination, and a sorting preference. This endpoint integrates with a 3rd party API.',
  })
  @ApiQuery({
    name: 'origin',
    required: true,
    description: 'IATA 3-letter code for the origin. e.g., MAD',
    example: 'MAD',
  })
  @ApiQuery({
    name: 'destination',
    required: true,
    description: 'IATA 3-letter code for the destination. e.g., BCN',
    example: 'BCN',
  })
  @ApiQuery({
    name: 'sort_by',
    required: true,
    enum: ['fastest', 'cheapest'],
    description: 'Sorting criteria for the results.',
    example: 'fastest',
  })
  @ApiResponse({
    status: 200,
    description:
      'An array of trips matching the search criteria, sorted as requested.',
    type: [TripResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid input parameters.' })
  @Get('search')
  async search(
    @Query('origin') origin: string,
    @Query('destination') destination: string,
    @Query('sort_by') sortBy: 'fastest' | 'cheapest',
  ): Promise<TripResponseDto[]> {
    this.logger.log(
      `Searching trips from ${origin} to ${destination}, sorted by ${sortBy}`,
    );
    const trips = await this.tripService.search(
      new SearchTripQuery(origin, destination, sortBy),
    );
    return trips.map((trip) => trip.toPrimitives());
  }

  @ApiOperation({ summary: 'Get a trip by its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Unique identifier (UUID) of the trip.',
    example: 'a749c866-7928-4d08-9d5c-a6821a583d1a',
  })
  @ApiResponse({
    status: 200,
    description: 'The trip corresponding to the provided ID.',
    type: TripResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'A trip with the specified ID was not found.',
  })
  @Get(':id')
  async getTripById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TripResponseDto> {
    this.logger.log('getTripById');
    const trip = await this.tripService.findById(new GetTripByIdQuery(id));
    return trip.toPrimitives();
  }

  @ApiOperation({ summary: 'Create and save a new trip' })
  @ApiBody({
    description: 'Data for the new trip to be created.',
    type: SaveTripDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The trip has been successfully created and saved.',
    type: TripResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Post()
  async save(@Body() saveTripDto: SaveTripDto): Promise<TripResponseDto> {
    this.logger.log(`Saving trip with data: ${JSON.stringify(saveTripDto)}`);
    const trip = await this.tripService.save(
      new SaveTripCommand({
        origin: saveTripDto.origin,
        destination: saveTripDto.destination,
        cost: saveTripDto.cost,
        duration: saveTripDto.duration,
        type: saveTripDto.type,
      }),
    );
    return trip.toPrimitives();
  }

  @ApiOperation({ summary: 'Update an existing trip' })
  @ApiBody({
    description:
      'Data to update for an existing trip. The trip ID is required.',
    type: UpdateTripDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The trip has been successfully updated.',
    type: TripResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'A trip with the specified ID was not found.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @Put()
  async update(@Body() updateTripDto: UpdateTripDto): Promise<TripResponseDto> {
    this.logger.log('update');
    const trip = await this.tripService.update(
      new UpdateTripCommand({
        ...updateTripDto,
      }),
    );
    return trip.toPrimitives();
  }

  @ApiOperation({ summary: 'Delete a trip' })
  @ApiBody({
    description: 'The ID of the trip to be deleted.',
    type: DeleteTripDto,
  })
  @ApiResponse({
    status: 200,
    description: 'The trip has been successfully deleted.',
    type: TripResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'A trip with the specified ID was not found.',
  })
  @Delete()
  async delete(@Body() deleteTripDto: DeleteTripDto): Promise<TripResponseDto> {
    this.logger.log('delete');
    const trip = await this.tripService.delete(
      new DeleteTripCommand(deleteTripDto.id),
    );
    return trip.toPrimitives();
  }
}
