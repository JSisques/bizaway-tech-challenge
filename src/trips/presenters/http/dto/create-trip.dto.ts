import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  origin: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  type: string;
}
