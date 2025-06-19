import { Field, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@InputType()
export class UpdateTripDto {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  origin?: string;

  @Field(() => String)
  @IsString()
  @IsOptional()
  destination?: string;

  @Field(() => Number)
  @IsNumber()
  @IsOptional()
  cost?: number;

  @Field(() => Number)
  @IsNumber()
  @IsOptional()
  duration?: number;

  @Field(() => String)
  @IsString()
  @IsOptional()
  type?: string;
}
