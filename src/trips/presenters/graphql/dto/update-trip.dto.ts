import { Field, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateTripDto } from './create-trip.dto';

@InputType()
export class UpdateTripDto extends PartialType(CreateTripDto) {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
