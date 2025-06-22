import { ApiProperty } from '@nestjs/swagger';

export class TripResponseDto {
  @ApiProperty({
    example: 'a749c866-7928-4d08-9d5c-a6821a583d1a',
    description: 'The unique identifier of the trip',
  })
  public readonly id: string;

  @ApiProperty({ example: 'MAD', description: 'The origin of the trip' })
  public readonly origin: string;

  @ApiProperty({ example: 'BCN', description: 'The destination of the trip' })
  public readonly destination: string;

  @ApiProperty({ example: 100, description: 'The cost of the trip' })
  public readonly cost: number;

  @ApiProperty({ example: 90, description: 'The duration of the trip' })
  public readonly duration: number;

  @ApiProperty({ example: 'train', description: 'The type of the trip' })
  public readonly type: string;

  @ApiProperty({
    example: 'from MAD to BCN by train',
    description: 'The display name of the trip',
  })
  public readonly displayName: string;

  constructor(
    id: string,
    origin: string,
    destination: string,
    cost: number,
    duration: number,
    type: string,
    displayName: string,
  ) {
    this.id = id;
    this.origin = origin;
    this.destination = destination;
    this.cost = cost;
    this.duration = duration;
    this.type = type;
    this.displayName = displayName;
  }
}
