import { IsNotEmpty, IsUUID } from 'class-validator';
import { SaveTripDto } from './save-trip.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTripDto extends PartialType(SaveTripDto) {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
