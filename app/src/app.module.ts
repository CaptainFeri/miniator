import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuperadminModule } from './superadmin/superadmin.module';
import appEnvConfig from './config/app-env.config';
import { AdminAuthMiddleware } from './superadmin/auth/middleware/admin-auth.middleware';

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
    SuperadminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminAuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
