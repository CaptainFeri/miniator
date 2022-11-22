import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/subadmin/entity/admin.entity';
import appEnvConfig from 'src/config/app-env.config';
import { SecurityQModule } from 'src/security-q/security-q.module';
import { ServiceModule } from 'src/service/service.module';
import { UserEntity } from 'src/users/entity/users.entity';
import { SuperadminAdminManagmenController } from './admin-managment/superadmin.admin.controller';
import { AdminAuthMiddleware } from './auth/middleware/admin-auth.middleware';
import { AdminJwtStrategy } from './auth/strategy/admin-jwt.strategy';
import { AdminSecurityQuestionManagmentController } from './security-question-managment/admin-security-question-managment.controller';
import { SuperAdminServiceManagmentController } from './service-managment/superadmin.service.controller';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { SuperAdminUserManagmentController } from './user-managment/superadmin.user.controller';
import { WalletEntity } from 'src/users/entity/wallet.entity';

@Module({
  imports: [
    SecurityQModule,
    ServiceModule,
    TypeOrmModule.forFeature([AdminEntity, UserEntity, WalletEntity]),
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
    SuperAdminUserManagmentController,
    AdminSecurityQuestionManagmentController,
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
