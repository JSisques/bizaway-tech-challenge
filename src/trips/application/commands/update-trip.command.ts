import { UpdateTripDto } from '../dtos/update-trip.dto';

export class UpdateTripCommand {
  constructor(public readonly trip: UpdateTripDto) {}
}
