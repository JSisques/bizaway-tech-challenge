import { DynamicModule, Module, Type } from '@nestjs/common';
import { TripsApplicationModule } from './application/trips-application.module';
import { TripsPresentersModule } from './presenters/trips-presenters.module';

@Module({
  providers: [],
})
export class TripsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: TripsModule,
      imports: [
        TripsApplicationModule,
        infrastructureModule,
        TripsPresentersModule,
      ],
    };
  }
}
