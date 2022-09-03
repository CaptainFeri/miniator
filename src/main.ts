// registers aliases, DON'T REMOVE THIS LINE!
import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import AppModule from './app.module';
import AllExceptionsFilter from './shared/filters/all-exceptions.filter';
import { swaggerConfig } from './config/swagger';
import { useGlobalPipes } from './config/global-pipe';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

import 'dotenv/config';

async function bootstrap() {
  const mode = process.env.MODE;
  if (mode === 'development') {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: true }),
    );
    const configService = app.get(ConfigService);
    // useGlobalGuards(app);
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
    const app = await NestFactory.createMicroservice(AppModule, {
      name: 'auth',
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:3000',
        package: 'auth',
        protoPath: [
          // join(__dirname, '../proto/account.proto'),
          join(__dirname, '../proto/admin.proto'),
          join(__dirname, '../proto/auth.proto'),
          join(__dirname, '../proto/company.proto'),
          join(__dirname, '../proto/question.proto'),
          join(__dirname, '../proto/roles.proto'),
          join(__dirname, '../proto/wallet.proto'),
        ],
        loader: {
          keepCase: true,
          longs: Number,
          enums: String,
          defaults: false,
          arrays: true,
          objects: true,
        },
      },
    });
    await app.listen();
  }
}

bootstrap().then();
