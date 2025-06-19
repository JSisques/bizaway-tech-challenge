import { DynamicModule, Module, Type } from '@nestjs/common';
import { TripsApplicationModule } from './application/trips-application.module';

@Module({
  providers: [],
})
export class TripsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: TripsModule,
      imports: [TripsApplicationModule, infrastructureModule],
    };
  }
}
