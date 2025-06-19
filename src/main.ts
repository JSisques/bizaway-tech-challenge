import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';

async function bootstrap() {
  const logger = new Logger('Main');

  const options: ApplicationBootstrapOptions = {
    databaseDriver:
      (process.env.DATABASE_DRIVER as 'in-memory' | 'type-orm') || 'in-memory',
    cacheDriver:
      (process.env.CACHE_DRIVER as 'in-memory' | 'noop' | 'redis') || 'noop',
  };

  const app = await NestFactory.create(AppModule.register(options));

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
