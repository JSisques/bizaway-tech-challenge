import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TripService } from './trips/application/trip.service';
import { TripController } from './trips/presenters/http/trips.controller';
import { TripsModule } from './trips/trips.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TripsModule,
  ],
  controllers: [AppController, TripController],
  providers: [AppService, TripService],
})
export class AppModule {}
