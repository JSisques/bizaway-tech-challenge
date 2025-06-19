import { Injectable } from '@nestjs/common';
import { Trip } from '../domain/trip';
import { TripRepository } from './ports/trip.repository';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllTripsQuery } from './queries/get-all-trips.query';
import { CreateTripCommand } from './commands/create-trip.command';
import { GetTripByIdQuery } from './queries/get-trip-by-id.query';
import { UpdateTripCommand } from './commands/update-trip.command';
import { DeleteTripCommand } from './commands/delete-trip.command';

@Injectable()
export class TripService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  public async findAll(getAllTripsQuery: GetAllTripsQuery): Promise<Trip[]> {
    return await this.queryBus.execute(getAllTripsQuery);
  }

  public async findById(getTripByIdQuery: GetTripByIdQuery): Promise<Trip> {
    return await this.queryBus.execute(getTripByIdQuery);
  }

  public async create(createTripCommand: CreateTripCommand): Promise<Trip> {
    return await this.commandBus.execute(createTripCommand);
  }

  public async update(updateTripCommand: UpdateTripCommand): Promise<Trip> {
    return await this.commandBus.execute(updateTripCommand);
  }

  public async delete(deleteTripCommand: DeleteTripCommand): Promise<Trip> {
    return await this.commandBus.execute(deleteTripCommand);
  }
}
