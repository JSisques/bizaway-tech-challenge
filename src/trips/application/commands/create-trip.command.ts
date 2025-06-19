import { CreateTripDto } from '../dtos/create-trip.dto';

export class CreateTripCommand {
  constructor(public readonly trip: CreateTripDto) {}
}
