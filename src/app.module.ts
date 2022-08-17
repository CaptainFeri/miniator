import { Module } from '@nestjs/common';
import { config } from 'src/config/config';
import { database } from 'src/config/database';
import { redis } from 'src/config/redis';
import { mailer } from 'src/config/mailer';
import RouteModule from './routes';

@Module({
  imports: [
    config,
    database,
    redis,
    mailer,
    RouteModule,
  ]
})
export default class AppModule { }
