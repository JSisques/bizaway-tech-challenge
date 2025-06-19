import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';
import { InMemoryCacheModule } from 'src/trips/infrastructure/cache/in-memory/in-memory-cache.module';
import { NoopCacheModule } from 'src/trips/infrastructure/cache/noop/noop-cache.module';
import { InMemoryPersistanceModule } from 'src/trips/infrastructure/persistance/in-memory/in-memory-persistance.module';

@Module({})
export class CoreModule {
  static forRoot(options: ApplicationBootstrapOptions) {
    let persistenceModule;
    switch (options.databaseDriver) {
      case 'in-memory':
        persistenceModule = InMemoryPersistanceModule;
        break;
      case 'type-orm':
        persistenceModule = TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: parseInt(process.env.POSTGRES_PORT),
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          database: process.env.POSTGRES_DB,
          autoLoadEntities: process.env.TYPE_ORM_AUTO_LOAD_ENTITIES === 'true',
          synchronize: process.env.TYPE_ORM_SYNCHRONIZE === 'true',
        });
        break;
      default:
        throw new Error(`Unsupported driver: ${options.databaseDriver}`);
    }

    let cacheModule;
    switch (options.cacheDriver) {
      case 'in-memory':
        cacheModule = InMemoryCacheModule;
        break;
      case 'noop':
        cacheModule = NoopCacheModule;
        break;
      //   case 'redis':
      //     cacheModule = RedisCacheModule;
      //     break;
      default:
        throw new Error(`Unsupported cache driver: ${options.cacheDriver}`);
    }

    return {
      module: CoreModule,
      imports: [persistenceModule, cacheModule],
    };
  }
}
