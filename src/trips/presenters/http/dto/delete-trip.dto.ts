import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteTripDto {
  @ApiProperty({
    description: 'The unique identifier of the trip to delete.',
    example: 'a749c866-7928-4d08-9d5c-a6821a583d1a',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
