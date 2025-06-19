import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { TripRepository } from '../ports/trip.repository';
import { Logger } from '@nestjs/common';
import { DeleteTripCommand } from './delete-trip.command';

@CommandHandler(DeleteTripCommand)
export class DeleteTripCommandHandler {
  private readonly logger = new Logger(DeleteTripCommandHandler.name);

  constructor(
    private readonly tripRepository: TripRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteTripCommand): Promise<void> {
    this.logger.debug('Executing DeleteTripCommand');
  }
}
