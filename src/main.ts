// registers aliases, DON'T REMOVE THIS LINE!
import 'module-alias/register';

import { NestFactory, Reflector } from '@nestjs/core';

import { FastifyAdapter, NestFastifyApplication, } from '@nestjs/platform-fastify';

import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import AppModule from './app.module';

import AllExceptionsFilter from './shared/filters/all-exceptions.filter';
import JwtAccessGuard from 'src/shared/guards/jwt-access.guard';
import { BasicAuthGuard } from 'src/shared/guards/basic-auth.guard';
import { swaggerConfig } from './config/swagger';
import { useGlobalGuards } from './config/global-guards';
import { useGlobalPipes } from './config/global-pipe';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { join } from 'path';


import 'dotenv/config';
async function bootstrap() {

  const mode = process.env.MODE;
  if (mode === "development") {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: true }),
    );
    const configService = app.get(ConfigService);
    useGlobalGuards(app);
    useGlobalPipes(app);
    app.useGlobalFilters(new AllExceptionsFilter());
    swaggerConfig(app);
    const port = configService.get<number>('PORT') || 3000;
    await app.listen(port, '0.0.0.0', async () => {
      console.log(
        `The server is running on ${port} port: http://localhost:${port}/api`,
      );
    });
  } else {
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: [
          join(__dirname, '../proto/auth.proto'),
        ]
      },
    });
  }
}

bootstrap().then();
