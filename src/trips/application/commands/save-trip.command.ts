import { SaveTripDto } from '../dtos/save-trip.dto';

export class SaveTripCommand {
  constructor(public readonly trip: SaveTripDto) {}
}
