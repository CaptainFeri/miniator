import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appEnvConfig from './config/app-env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appEnvConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (
        configService: ConfigService<ConfigType<typeof appEnvConfig>>,
      ) => {
        const postgresConfig = configService.get('postgres', { infer: true });
        return {
          type: 'postgres',
          host: postgresConfig.url,
          port: +postgresConfig.port,
          username: postgresConfig.username,
          password: postgresConfig.password,
          database: postgresConfig.dbname,
          entities: ['dist/**/*.entity{.ts,.js}'],
          migrations: ['dist/migrations/**/*{.ts,.js}'],
          migrationsRun: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
