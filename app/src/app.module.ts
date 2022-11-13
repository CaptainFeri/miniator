import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appEnvVonfig from './config/app-env.vonfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appEnvVonfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
