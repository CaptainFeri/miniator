import { Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import appEnvConfig from 'src/config/app-env.config';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import AdminTokenPayload from '../interface/adminTokenPayload.interface';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly superadminService: SuperadminService,
    private readonly configService: ConfigService<
      ConfigType<typeof appEnvConfig>
    >,
  ) {
    const adminInfo = configService.get('admin', { infer: true });
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: adminInfo.superAdminJwtSecret,
    });
  }

  async validate(payload: AdminTokenPayload) {
    return await this.superadminService.findById(payload);
  }
}
