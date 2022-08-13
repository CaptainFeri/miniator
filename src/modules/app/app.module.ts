import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import V1Module from '@v1/v1.module';

import AppService from './app.service';
import AppController from './app.controller';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get('DB_HOST'),
        port: cfg.get<number>('DB_PORT'),
        username: cfg.get('DB_USER'),
        password: cfg.get('DB_PASSWORD'),
        database: cfg.get('DB_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: cfg.get('NODE_ENV', 'development') === 'development',
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        config: {
          host: cfg.get('REDIS_HOST'),
          port: 6379,
        },
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (cfg: ConfigService) => ({
        transport: {
          host: cfg.get('MAILER_HOST'),
          port: Number(cfg.get('MAILER_PORT')),
          secure: false,
          auth: {
            user: cfg.get('MAILER_USERNAME'),
            pass: cfg.get('MAILER_PASSWORD'),
          },
        },
        defaults: {
          from: cfg.get('MAILER_FROM_EMAIL'),
        },
        template: {
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    V1Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export default class AppModule {}
