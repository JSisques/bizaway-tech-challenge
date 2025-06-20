import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { SaveTripDto } from 'src/trips/presenters/http/dto/save-trip.dto';
import { UpdateTripDto } from 'src/trips/presenters/http/dto/update-trip.dto';

describe('TripsController (e2e)', () => {
  let app: INestApplication;

  // Mock para el servicio HTTP externo
  const mockHttpService = {
    get: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService) // Sobrescribimos el HttpService
      .useValue(mockHttpService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // Usamos los mismos pipes que en producción
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let tripId: string;

  describe('/trips (POST)', () => {
    it('should create a trip successfully', () => {
      const saveTripDto: SaveTripDto = {
        origin: 'SYD',
        destination: 'MAD',
        cost: 750,
        duration: 14,
        type: 'flight',
      };

      return request(app.getHttpServer())
        .post('/trips')
        .send(saveTripDto)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({
            id: expect.any(String),
            ...saveTripDto,
            displayName: 'SYD -> MAD',
          });
          tripId = response.body.id;
        });
    });

    it('should fail with invalid data', () => {
      const invalidDto = { origin: 'SYD' };
      return request(app.getHttpServer())
        .post('/trips')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/trips/:id (GET)', () => {
    it('should return a specific trip', () => {
      return request(app.getHttpServer())
        .get(`/trips/${tripId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(tripId);
        });
    });

    it('should return 404 for a non-existent trip', () => {
      return request(app.getHttpServer())
        .get('/trips/non-existent-id')
        .expect(404);
    });
  });

  describe('/trips/search (GET)', () => {
    it('should return a list of trips from the external mock API', () => {
      const mockApiResponse: AxiosResponse = {
        data: [
          {
            id: 'external-1',
            origin: 'BCN',
            destination: 'JFK',
            cost: 800,
            duration: 8,
            type: 'flight',
          },
        ],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };
      mockHttpService.get.mockReturnValue(of(mockApiResponse));

      return request(app.getHttpServer())
        .get('/trips/search?origin=BCN&destination=JFK&sortBy=cheapest')
        .expect(200)
        .then((response) => {
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body[0].id).toBe('external-1');
          expect(mockHttpService.get).toHaveBeenCalled();
        });
    });
  });

  describe('/trips (UPDATE)', () => {
    it('should update a trip successfully', () => {
      const updateTripDto: UpdateTripDto = { id: tripId, cost: 800 };

      return request(app.getHttpServer())
        .put(`/trips`)
        .send(updateTripDto)
        .expect(200)
        .then((response) => {
          expect(response.body.cost).toBe(800);
        });
    });
  });

  describe('/trips (DELETE)', () => {
    it('should delete a trip successfully', () => {
      return request(app.getHttpServer()).delete(`/trips`).expect(200);
    });

    it('should return 404 after deleting', () => {
      return request(app.getHttpServer()).get(`/trips/${tripId}`).expect(404);
    });
  });
});
