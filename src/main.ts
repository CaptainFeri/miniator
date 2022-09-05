import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useGlobalPipes } from './config/global-pipe';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { useGlobalGuards } from './config/global-guards';
import { useGlobalFilters } from './config/global-filters';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<GrpcOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:3000',
      package: 'auth',
      protoPath: [
        'proto/account.proto',
        'proto/admin.proto',
        'proto/auth.proto',
        'proto/company.proto',
        'proto/question.proto',
        'proto/roles.proto',
        'proto/wallet-type.proto',
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
  useGlobalPipes(app);
  await app.listen();
}

bootstrap().then();
