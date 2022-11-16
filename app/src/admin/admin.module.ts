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

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
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
