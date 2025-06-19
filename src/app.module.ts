import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { CoreModule } from './core/core.module';
import { TripsInfrastructureModule } from './trips/infrastructure/trips-infrastructure.module';
import { CqrsModule } from '@nestjs/cqrs';
import { TripsApplicationModule } from './trips/application/trips-application.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    return {
      module: AppModule,
      imports: [
        CoreModule.forRoot(options),
        TripsApplicationModule.withInfrastructure(
          TripsInfrastructureModule.use(
            options.databaseDriver,
            options.cacheDriver,
          ),
        ),
      ],
    };
  }
}
