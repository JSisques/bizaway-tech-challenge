import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotImplementedException,
  Param,
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
  async findAll(): Promise<Trip[]> {
    this.logger.log('findAll');
    return [];
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Trip> {
    this.logger.log('findById');
    throw new NotImplementedException('Trip not found');
  }

  @Get('search')
  async search(@Query('query') query: string): Promise<Trip[]> {
    this.logger.log('search');
    throw new NotImplementedException('Trip not found');
  }

  @Post()
  async create(@Body() createTripDto: CreateTripDto): Promise<Trip> {
    this.logger.log('create');
    throw new NotImplementedException('Trip not found');
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
  ): Promise<Trip> {
    this.logger.log('update');
    throw new NotImplementedException('Trip not found');
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    this.logger.log('delete');
    throw new NotImplementedException('Trip not found');
  }
}
