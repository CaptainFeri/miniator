import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import appEnvConfig from '../config/app-env.config';
import { UserJwtStrategy } from './auth/strategy/user-jwt.strategy';
import { UserAuthMiddleware } from './auth/middleware/user-auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<ConfigType<typeof appEnvConfig>>,
      ) => ({
        secret: configService.get('user', { infer: true }).userJwtSecret,
        signOptions: {
          expiresIn: configService.get('user', { infer: true })
            .userJwtExpirationTime,
        },
      }),
    }),
  ],
  providers: [UsersService, UserJwtStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
