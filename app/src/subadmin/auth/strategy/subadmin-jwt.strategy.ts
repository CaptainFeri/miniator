import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from 'src/subadmin/admin.service';
import appEnvConfig from 'src/config/app-env.config';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import AdminTokenPayload from '../interface/subAdminTokenPayload.interface';

@Injectable()
export class SubAdminJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly adminService: AdminService,
    private readonly configService: ConfigService<
      ConfigType<typeof appEnvConfig>
    >,
  ) {
    const adminInfo = configService.get('admin', { infer: true });
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: adminInfo.subAdminJwtSecret,
    });
  }

  async validate() {
    return true;
  }
}
