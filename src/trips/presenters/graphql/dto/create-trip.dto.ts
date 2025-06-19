import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class CreateTripDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  origin: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  destination: string;

  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  cost: number;

  @Field(() => Number)
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  type: string;
}
