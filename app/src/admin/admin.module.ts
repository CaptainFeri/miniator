import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entity/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import appEnvConfig from 'src/config/app-env.config';
import { SubAdminJwtStrategy } from './auth/strategy/subadmin-jwt.strategy';
import { SubAdminAuthMiddleware } from './auth/middleware/sub-admin.middleware';
import { UsersModule } from 'src/users/users.module';
import { ServiceEntity } from 'src/service/entity/service.entity';
import { RoleEntity } from 'src/role/entity/role.entity';
import { ServiceModule } from 'src/service/service.module';

@Module({
  imports: [
    UsersModule,
    ServiceModule,
    TypeOrmModule.forFeature([AdminEntity, ServiceEntity, RoleEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<ConfigType<typeof appEnvConfig>>,
      ) => ({
        secret: configService.get('admin', { infer: true }).subAdminJwtSecret,
        signOptions: {
          expiresIn: configService.get('admin', { infer: true })
            .subAdminJwtExpirationTime,
        },
      }),
    }),
  ],
  providers: [AdminService, SubAdminJwtStrategy],
  controllers: [AdminController],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SubAdminAuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
