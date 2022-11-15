import { Module } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entity/admin.entity';
import appEnvConfig from 'src/config/app-env.config';
import { AdminJwtStrategy } from './auth/strategy/admin-jwt.strategy';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';

@Module({
  imports: [
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
  controllers: [SuperadminController],
  exports: [SuperadminService],
})
export class SuperadminModule {}
