import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SaveTripDto {
  @ApiProperty({
    description: 'The origin of the trip. Must be a valid IATA code.',
    example: 'MAD',
  })
  @IsString()
  @IsNotEmpty()
  origin: string;

  @ApiProperty({
    description: 'The destination of the trip. Must be a valid IATA code.',
    example: 'BCN',
  })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiProperty({
    description: 'The cost of the trip in EUR.',
    example: 150.5,
  })
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @ApiProperty({
    description: 'The duration of the trip in minutes.',
    example: 120,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({
    description: 'The type of transport for the trip.',
    example: 'train',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}
