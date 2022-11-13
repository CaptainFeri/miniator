import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import appEnvConfig from 'src/config/app-env.config';
import { AdminJwtStrategy } from './auth/strategy/admin-jwt.strategy';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';

@Module({
  imports: [
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
  controllers: [SuperadminController],
  exports: [SuperadminService],
})
export class SuperadminModule {}
