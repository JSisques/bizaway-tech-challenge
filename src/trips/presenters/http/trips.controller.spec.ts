import { Test, TestingModule } from '@nestjs/testing';
import { TripController } from './trips.controller';
import { TripService } from 'src/trips/application/trip.service';
import { TripNotFoundException } from 'src/trips/domain/exceptions/trip-not-found.exception';
import { SaveTripDto } from './dto/save-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { DeleteTripDto } from './dto/delete-trip.dto';
import { Logger } from '@nestjs/common';
import { TripResponseDto } from './dto/trip-response.dto';

// Mock data for tests
const mockTripId = 'a749c866-7928-4d08-9d5c-a6821a583d1a';
const mockTrip: TripResponseDto = {
  id: mockTripId,
  origin: 'MAD',
  destination: 'BCN',
  cost: 100,
  duration: 120,
  type: 'train',
  displayName: 'from MAD to BCN by train',
};

describe('TripController', () => {
  let controller: TripController;
  let service: TripService;

  const mockTripService = {
    findAll: jest.fn(),
    search: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockTripDomainEntity = {
    toPrimitives: () => mockTrip,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripController],
      providers: [
        {
          provide: TripService,
          useValue: mockTripService,
        },
      ],
    })
      .setLogger(new Logger())
      .compile();

    controller = module.get<TripController>(TripController);
    service = module.get<TripService>(TripService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllTrips', () => {
    it('should return an array of trips', async () => {
      const trips = [mockTrip];
      mockTripService.findAll.mockResolvedValue([mockTripDomainEntity]);

      const result = await controller.getAllTrips();

      expect(result).toEqual(trips);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should return an array of found trips', async () => {
      const trips = [mockTrip];
      const origin = 'MAD';
      const destination = 'BCN';
      const sortBy = 'fastest';
      mockTripService.search.mockResolvedValue([mockTripDomainEntity]);

      const result = await controller.search(origin, destination, sortBy);

      expect(result).toEqual(trips);
      expect(service.search).toHaveBeenCalled();
    });
  });

  describe('getTripById', () => {
    it('should return a single trip when a valid ID is provided', async () => {
      mockTripService.findById.mockResolvedValue(mockTripDomainEntity);

      const result = await controller.getTripById(mockTripId);

      expect(result).toEqual(mockTrip);
      expect(service.findById).toHaveBeenCalledWith(expect.anything());
    });

    it('should throw TripNotFoundException if the trip does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      mockTripService.findById.mockRejectedValue(
        new TripNotFoundException(nonExistentId),
      );

      await expect(controller.getTripById(nonExistentId)).rejects.toThrow(
        TripNotFoundException,
      );
    });
  });

  describe('save', () => {
    it('should create and return a new trip', async () => {
      const saveTripDto: SaveTripDto = {
        origin: 'MAD',
        destination: 'BCN',
        cost: 100,
        duration: 120,
        type: 'train',
      };
      mockTripService.save.mockResolvedValue(mockTripDomainEntity);

      const result = await controller.save(saveTripDto);

      expect(result).toEqual(mockTrip);
      expect(service.save).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('update', () => {
    it('should update and return the trip', async () => {
      const updateTripDto: UpdateTripDto = {
        id: mockTripId,
        cost: 150,
      };
      const updatedTrip = { ...mockTrip, cost: 150 };
      mockTripService.update.mockResolvedValue({
        toPrimitives: () => updatedTrip,
      });

      const result = await controller.update(updateTripDto);

      expect(result).toEqual(updatedTrip);
      expect(service.update).toHaveBeenCalledWith(expect.anything());
    });

    it('should throw TripNotFoundException if the trip to update does not exist', async () => {
      const updateTripDto: UpdateTripDto = {
        id: '00000000-0000-0000-0000-000000000000',
      };
      mockTripService.update.mockRejectedValue(
        new TripNotFoundException(updateTripDto.id),
      );

      await expect(controller.update(updateTripDto)).rejects.toThrow(
        TripNotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete and return the trip', async () => {
      const deleteTripDto: DeleteTripDto = { id: mockTripId };
      mockTripService.delete.mockResolvedValue(mockTripDomainEntity);

      const result = await controller.delete(deleteTripDto);

      expect(result).toEqual(mockTrip);
      expect(service.delete).toHaveBeenCalledWith(expect.anything());
    });

    it('should throw TripNotFoundException if the trip to delete does not exist', async () => {
      const deleteTripDto: DeleteTripDto = {
        id: '00000000-0000-0000-0000-000000000000',
      };
      mockTripService.delete.mockRejectedValue(
        new TripNotFoundException(deleteTripDto.id),
      );

      await expect(controller.delete(deleteTripDto)).rejects.toThrow(
        TripNotFoundException,
      );
    });
  });
});
