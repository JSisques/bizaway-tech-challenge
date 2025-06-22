import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LogLevel, ValidationPipe } from '@nestjs/common';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'process';

async function bootstrap() {
  const logger = new Logger('Main');

  const databaseDriver = process.env.DATABASE_DRIVER as
    | 'in-memory'
    | 'type-orm';
  const cacheDriver = process.env.CACHE_DRIVER as
    | 'in-memory'
    | 'noop'
    | 'redis';

  const options: ApplicationBootstrapOptions = {
    databaseDriver: databaseDriver || 'in-memory',
    cacheDriver: cacheDriver || 'noop',
  };

  const loggerOptions: LogLevel[] =
    process.env.NODE_ENV === 'production'
      ? ['log', 'warn', 'error']
      : ['log', 'warn', 'error', 'debug', 'verbose'];

  const app = await NestFactory.create(AppModule.register(options), {
    logger: loggerOptions,
  });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Trip API')
    .setDescription('API for managing trips')
    .setVersion('1.0')
    .addTag('trips')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);

  logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);

  logger.debug(`Environment: ${process.env.NODE_ENV ?? 'development'}`);
  logger.debug(`Database driver: ${options.databaseDriver}`);
  logger.debug(`Cache driver: ${options.cacheDriver}`);
}
bootstrap();
