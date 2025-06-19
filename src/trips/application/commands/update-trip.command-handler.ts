import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TripRepository } from '../ports/trip.repository';
import { Logger } from '@nestjs/common';
import { UpdateTripCommand } from './update-trip.command';

@CommandHandler(UpdateTripCommand)
export class UpdateTripCommandHandler
  implements ICommandHandler<UpdateTripCommand>
{
  private readonly logger = new Logger(UpdateTripCommandHandler.name);

  constructor(
    private readonly tripRepository: TripRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateTripCommand): Promise<void> {
    this.logger.debug('Executing UpdateTripCommand');
  }
}
