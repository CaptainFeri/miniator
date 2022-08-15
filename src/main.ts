// registers aliases, DON'T REMOVE THIS LINE!
import 'module-alias/register';

import { NestFactory, Reflector } from '@nestjs/core';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import AppModule from './modules/app/app.module';

import AllExceptionsFilter from './filters/all-exceptions.filter';
import JwtAccessGuard from '@guards/jwt-access.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  app.useGlobalGuards(
    // new BasicAuthGuard(configService),
    new JwtAccessGuard(reflector, configService),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());

  const options = new DocumentBuilder()
    .setTitle('Api v1')
    .setDescription('The boilerplate API for nestjs devs')
    .setVersion('1.0')
    .addBearerAuth({
      in: 'header',
      type: 'http',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port, '0.0.0.0', async () => {
    console.log(
      `The server is running on ${port} port: http://localhost:${port}/api`,
    );
  });
}

bootstrap().then();
