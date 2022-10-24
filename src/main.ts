import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useGlobalPipes } from './config/global-pipe';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { useGlobalGuards } from './config/global-guards';
import { useGlobalFilters } from './config/global-filters';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      }
    },
  });
  useGlobalGuards(app);
  useGlobalFilters(app);
  useGlobalPipes(app);
  await app.listen();
}

bootstrap().then();
