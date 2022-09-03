import { Module } from '@nestjs/common';
import { config } from './config/config';
import { database } from './config/database';
import { redis } from './config/redis';
import { mailer } from './config/mailer';
import RouteModule from './routes';

@Module({
  imports: [config, database, redis, mailer, RouteModule],
})
export default class AppModule {}
