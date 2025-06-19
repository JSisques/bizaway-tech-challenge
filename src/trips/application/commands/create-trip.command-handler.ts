import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateTripCommand } from './create-trip.command';
import { TripRepository } from '../ports/trip.repository';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateTripCommand)
export class CreateTripCommandHandler
  implements ICommandHandler<CreateTripCommand>
{
  private readonly logger = new Logger(CreateTripCommandHandler.name);

  constructor(
    private readonly tripRepository: TripRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTripCommand): Promise<void> {
    this.logger.debug('Executing CreateTripCommand');
  }
}
