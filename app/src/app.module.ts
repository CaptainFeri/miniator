import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { SuperadminModule } from './superadmin/superadmin.module';
import appEnvConfig from './config/app-env.config';
import { AdminAuthMiddleware } from './superadmin/auth/middleware/admin-auth.middleware';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { ServiceModule } from './service/service.module';
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { SecurityQModule } from './security-q/security-q.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
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
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    SuperadminModule,
    AdminModule,
    ServiceModule,
    UsersModule,
    RoleModule,
    SecurityQModule,
  ],
  providers: [AppService],
})
export class AppModule {}
