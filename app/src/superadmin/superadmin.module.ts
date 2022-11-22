import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entity/admin.entity';
import appEnvConfig from 'src/config/app-env.config';
import { ServiceEntity } from 'src/service/entity/service.entity';
import { ServiceModule } from 'src/service/service.module';
import { SuperadminAdminManagmenController } from './admin-managment/superadmin.admin.controller';
import { AdminAuthMiddleware } from './auth/middleware/admin-auth.middleware';
import { AdminJwtStrategy } from './auth/strategy/admin-jwt.strategy';
import { SuperAdminServiceManagmentController } from './service-managment/superadmin.service.controller';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';

@Module({
  imports: [
    ServiceModule,
    TypeOrmModule.forFeature([AdminEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<ConfigType<typeof appEnvConfig>>,
      ) => ({
        secret: configService.get('admin', { infer: true }).superAdminJwtSecret,
        signOptions: {
          expiresIn: configService.get('admin', { infer: true })
            .superAdminJwtExpirationTime,
        },
      }),
    }),
  ],
  providers: [SuperadminService, AdminJwtStrategy],
  controllers: [
    SuperadminController,
    SuperAdminServiceManagmentController,
    SuperadminAdminManagmenController,
  ],
  exports: [SuperadminService],
})
export class SuperadminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminAuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
