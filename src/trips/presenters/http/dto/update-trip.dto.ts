import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { SaveTripDto } from './save-trip.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateTripDto extends PartialType(SaveTripDto) {
  @ApiProperty({
    description: 'The unique identifier of the trip to update.',
    example: 'a749c866-7928-4d08-9d5c-a6821a583d1a',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
