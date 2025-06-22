import { Injectable } from '@nestjs/common';
import { Trip } from '../domain/trip';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAllTripsQuery } from './queries/get-all-trips.query';
import { SaveTripCommand } from './commands/save-trip.command';
import { GetTripByIdQuery } from './queries/get-trip-by-id.query';
import { UpdateTripCommand } from './commands/update-trip.command';
import { DeleteTripCommand } from './commands/delete-trip.command';
import { SearchTripQuery } from './queries/search-trip.query';

/**
 * Service class that handles trip-related operations using CQRS pattern
 */
@Injectable()
export class TripService {
  /**
   * Creates an instance of TripService
   * @param commandBus - Bus for dispatching commands
   * @param queryBus - Bus for dispatching queries
   */
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  /**
   * Retrieves all trips
   * @param getAllTripsQuery - Query to get all trips
   * @returns Promise containing array of Trip entities
   */
  public async findAll(getAllTripsQuery: GetAllTripsQuery): Promise<Trip[]> {
    return await this.queryBus.execute(getAllTripsQuery);
  }

  /**
   * Finds a trip by its ID
   * @param getTripByIdQuery - Query containing trip ID to find
   * @returns Promise containing the found Trip entity
   */
  public async findById(getTripByIdQuery: GetTripByIdQuery): Promise<Trip> {
    return await this.queryBus.execute(getTripByIdQuery);
  }

  /**
   * Searches for trips based on criteria
   * @param searchTripQuery - Query containing search criteria
   * @returns Promise containing array of matching Trip entities
   */
  public async search(searchTripQuery: SearchTripQuery): Promise<Trip[]> {
    return await this.queryBus.execute(searchTripQuery);
  }

  /**
   * Saves a new trip
   * @param saveTripCommand - Command containing trip data to save
   * @returns Promise containing the saved Trip entity
   */
  public async save(saveTripCommand: SaveTripCommand): Promise<Trip> {
    return await this.commandBus.execute(saveTripCommand);
  }

  /**
   * Updates an existing trip
   * @param updateTripCommand - Command containing trip data to update
   * @returns Promise containing the updated Trip entity
   */
  public async update(updateTripCommand: UpdateTripCommand): Promise<Trip> {
    return await this.commandBus.execute(updateTripCommand);
  }

  /**
   * Deletes an existing trip
   * @param deleteTripCommand - Command containing trip ID to delete
   * @returns Promise containing the deleted Trip entity
   */
  public async delete(deleteTripCommand: DeleteTripCommand): Promise<Trip> {
    return await this.commandBus.execute(deleteTripCommand);
  }
}
