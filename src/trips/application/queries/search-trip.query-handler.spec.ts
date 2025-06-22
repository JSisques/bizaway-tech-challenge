import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { of } from 'rxjs';
import { SearchQueryHandler } from './search-trip.query-handler';
import { TripCacheRepository } from '../ports/trip-cache.repository';
import { TripSortingService } from 'src/trips/domain/services/trip-sorting.service';
import { SearchTripQuery } from './search-trip.query';
import { Trip } from 'src/trips/domain/trip';
import { TripPrimitive } from 'src/trips/domain/primitives/trip.primitive';

// Mock data
const mockTripPrimitive: TripPrimitive = {
  id: '1',
  origin: 'MAD',
  destination: 'BCN',
  cost: 100,
  duration: 120,
  type: 'train',
  displayName: 'from MAD to BCN by train',
};
const mockTrip = Trip.fromPrimitives(mockTripPrimitive);

describe('SearchQueryHandler', () => {
  let handler: SearchQueryHandler;
  let configService: ConfigService;
  let tripCacheRepository: TripCacheRepository;
  let httpService: HttpService;
  let tripSortingService: TripSortingService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'API_URL') return 'http://test-api.com';
      if (key === 'API_KEY') return 'test-key';
      return null;
    }),
  };

  const mockTripCacheRepository = {
    getSearchQuery: jest.fn(),
    setSearchQuery: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockTripSortingService = {
    sortTrips: jest.fn().mockImplementation((trips) => trips), // Simple pass-through for most tests
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchQueryHandler,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: TripCacheRepository, useValue: mockTripCacheRepository },
        { provide: HttpService, useValue: mockHttpService },
        { provide: TripSortingService, useValue: mockTripSortingService },
      ],
    })
      .setLogger(new Logger())
      .compile();

    handler = module.get<SearchQueryHandler>(SearchQueryHandler);
    configService = module.get<ConfigService>(ConfigService);
    tripCacheRepository = module.get<TripCacheRepository>(TripCacheRepository);
    httpService = module.get<HttpService>(HttpService);
    tripSortingService = module.get<TripSortingService>(TripSortingService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    const query = new SearchTripQuery('MAD', 'BCN', 'fastest');

    it('should return trips from cache if available', async () => {
      mockTripCacheRepository.getSearchQuery.mockResolvedValue([mockTrip]);

      const result = await handler.execute(query);

      expect(result).toEqual([mockTrip]);
      expect(mockTripCacheRepository.getSearchQuery).toHaveBeenCalledWith(
        'MAD-BCN-fastest',
      );
      expect(mockHttpService.get).not.toHaveBeenCalled();
    });

    it('should fetch from API, sort, cache, and return trips if not in cache', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'API_URL') return 'http://test-api.com';
        if (key === 'API_KEY') return 'test-key';
        return null;
      });
      mockTripCacheRepository.getSearchQuery.mockResolvedValue(null);
      const apiResponse = {
        data: [mockTripPrimitive],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));

      const result = await handler.execute(query);

      expect(result).toEqual([mockTrip]);
      expect(mockHttpService.get).toHaveBeenCalledWith('http://test-api.com', {
        params: { origin: 'MAD', destination: 'BCN' },
        headers: { 'x-api-key': 'test-key' },
      });
      expect(mockTripSortingService.sortTrips).toHaveBeenCalledWith(
        [expect.any(Trip)],
        'fastest',
      );
      expect(mockTripCacheRepository.setSearchQuery).toHaveBeenCalledWith(
        'MAD-BCN-fastest',
        [mockTrip],
      );
    });

    it('should throw an error if API_URL is not set', async () => {
      mockConfigService.get.mockImplementation((key) =>
        key === 'API_KEY' ? 'test-key' : null,
      );
      mockTripCacheRepository.getSearchQuery.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(
        'API URL is not set',
      );
    });

    it('should throw an error if API_KEY is not set', async () => {
      mockConfigService.get.mockImplementation((key) =>
        key === 'API_URL' ? 'http://test-api.com' : null,
      );
      mockTripCacheRepository.getSearchQuery.mockResolvedValue(null);

      await expect(handler.execute(query)).rejects.toThrow(
        'API Key is not set',
      );
    });

    it('should throw an error if the external API call fails', async () => {
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'API_URL') return 'http://test-api.com';
        if (key === 'API_KEY') return 'test-key';
        return null;
      });
      mockTripCacheRepository.getSearchQuery.mockResolvedValue(null);
      const apiResponse = {
        data: [],
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as any,
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));

      await expect(handler.execute(query)).rejects.toThrow(
        'Failed to fetch data from external API',
      );
    });
  });
});
