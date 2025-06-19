import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class DeleteTripDto {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
