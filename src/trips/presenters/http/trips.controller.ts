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

@Controller('trips')
export class TripController {
  private readonly logger = new Logger(TripController.name);

  @Get()
  async getAllTrips(): Promise<Trip[]> {
    this.logger.log('getAllTrips');
    return [];
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
    throw new NotImplementedException('Search not implemented');
  }

  @Get(':id')
  async getTripById(@Param('id', ParseUUIDPipe) id: string): Promise<Trip> {
    this.logger.log('getTripById');
    throw new NotImplementedException('Trip not found');
  }

  @Post()
  async create(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    this.logger.log('create');
    throw new NotImplementedException('Trip not found');
  }

  @Put(':id')
  async update(@Body() updateTripDto: UpdateTripDto): Promise<Trip> {
    this.logger.log('update');
    throw new NotImplementedException('Trip not found');
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    this.logger.log('delete');
    throw new NotImplementedException('Trip not found');
  }
}
