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
import { GrpcOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { useGlobalGuards } from './config/global-guards';
import { useGlobalFilters } from './config/global-filters';

async function bootstrap() {
  const mode = process.env.MODE;
  if (mode === 'development') {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({ logger: true }),
    );
    const configService = app.get(ConfigService);
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
    const app = await NestFactory.createMicroservice<GrpcOptions>(AppModule, {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:3000',
        package: 'auth',
        protoPath: [
          // 'proto/account.proto',
          'proto/admin.proto',
          'proto/auth.proto',
          'proto/company.proto',
          'proto/question.proto',
          'proto/roles.proto',
          'proto/wallet.proto',
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
    useGlobalGuards(app);
    useGlobalFilters(app);
    await app.listen();
  }
}

bootstrap().then();
