import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import appEnvConfig from '../../../config/app-env.config';
import { AdminExpressRequest } from '../types/adminExpressRequest';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService<
      ConfigType<typeof appEnvConfig>
    >,
    private readonly superAdminService: SuperadminService,
  ) {}

  async use(req: AdminExpressRequest, res: any, next: (error?: any) => void) {
    try {
      if (!req.headers.authorization) {
        req.admin = null;
        next();
        return;
      }
      const token = req.headers.authorization.split(' ')[1];
      const adminInfo = this.configService.get('admin', { infer: true });
      const decode = verify(token, adminInfo.superAdminJwtSecret);
      const adminUser = await this.superAdminService.findById(
        decode['adminId'],
      );
      req.admin = adminUser;
      next();
    } catch (e) {
      req.admin = null;
      next();
    }
  }
}
