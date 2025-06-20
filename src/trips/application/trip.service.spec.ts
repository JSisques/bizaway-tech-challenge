import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { TripService } from './trip.service';
import { GetAllTripsQuery } from './queries/get-all-trips.query';
import { GetTripByIdQuery } from './queries/get-trip-by-id.query';
import { SearchTripQuery } from './queries/search-trip.query';
import { SaveTripCommand } from './commands/save-trip.command';
import { UpdateTripCommand } from './commands/update-trip.command';
import { DeleteTripCommand } from './commands/delete-trip.command';
import { Trip } from '../domain/trip';

describe('TripService', () => {
  let service: TripService;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  const mockTrip = { id: '1' } as Trip;
  const mockTripArray = [mockTrip];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TripService>(TripService);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should execute GetAllTripsQuery and return the result', async () => {
      const query = new GetAllTripsQuery();
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockTripArray);

      const result = await service.findAll(query);

      expect(queryBus.execute).toHaveBeenCalledWith(query);
      expect(result).toBe(mockTripArray);
    });
  });

  describe('findById', () => {
    it('should execute GetTripByIdQuery and return the result', async () => {
      const query = new GetTripByIdQuery('1');
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockTrip);

      const result = await service.findById(query);

      expect(queryBus.execute).toHaveBeenCalledWith(query);
      expect(result).toBe(mockTrip);
    });
  });

  describe('search', () => {
    it('should execute SearchTripQuery and return the result', async () => {
      const query = new SearchTripQuery('SYD', 'MAD');
      jest.spyOn(queryBus, 'execute').mockResolvedValue(mockTripArray);

      const result = await service.search(query);

      expect(queryBus.execute).toHaveBeenCalledWith(query);
      expect(result).toBe(mockTripArray);
    });
  });

  describe('save', () => {
    it('should execute SaveTripCommand and return the result', async () => {
      const command = new SaveTripCommand({
        origin: 'SYD',
        destination: 'MAD',
        cost: 500,
        duration: 12,
        type: 'flight',
      });
      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockTrip);

      const result = await service.save(command);

      expect(commandBus.execute).toHaveBeenCalledWith(command);
      expect(result).toBe(mockTrip);
    });
  });

  describe('update', () => {
    it('should execute UpdateTripCommand and return the result', async () => {
      const command = new UpdateTripCommand({
        id: '1',
      });
      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockTrip);

      const result = await service.update(command);

      expect(commandBus.execute).toHaveBeenCalledWith(command);
      expect(result).toBe(mockTrip);
    });
  });

  describe('delete', () => {
    it('should execute DeleteTripCommand and return the result', async () => {
      const command = new DeleteTripCommand('1');
      jest.spyOn(commandBus, 'execute').mockResolvedValue(mockTrip);

      const result = await service.delete(command);

      expect(commandBus.execute).toHaveBeenCalledWith(command);
      expect(result).toBe(mockTrip);
    });
  });
});
