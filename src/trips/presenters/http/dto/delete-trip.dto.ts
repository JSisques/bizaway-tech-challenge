import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteTripDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
