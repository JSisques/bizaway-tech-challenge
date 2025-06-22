import { Module } from '@nestjs/common';
import { InMemoryPersistanceModule } from './persistance/in-memory/in-memory-persistance.module';
import { NoopCacheModule } from './cache/noop/noop-cache.module';
import { InMemoryCacheModule } from './cache/in-memory/in-memory-cache.module';
import { TypeOrmPersistanceModule } from './persistance/type-orm/type-orm-persistance.module';
import { RedisCacheModule } from './cache/redis/redis-cache.module';

@Module({})
export class TripsInfrastructureModule {
  static use(
    databaseDriver: 'in-memory' | 'type-orm',
    cacheDriver: 'in-memory' | 'noop' | 'redis',
  ) {
    let persistenceModule;
    switch (databaseDriver) {
      case 'in-memory':
        persistenceModule = InMemoryPersistanceModule;
        break;
      case 'type-orm':
        persistenceModule = TypeOrmPersistanceModule;
        break;
      default:
        persistenceModule = InMemoryPersistanceModule;
    }

    let cacheModule;
    switch (cacheDriver) {
      case 'in-memory':
        cacheModule = InMemoryCacheModule;
        break;
      case 'noop':
        cacheModule = NoopCacheModule;
        break;
      case 'redis':
        cacheModule = RedisCacheModule;
        break;
      default:
        cacheModule = NoopCacheModule;
    }

    return {
      module: TripsInfrastructureModule,
      imports: [persistenceModule, cacheModule],
      exports: [persistenceModule, cacheModule],
    };
  }
}
