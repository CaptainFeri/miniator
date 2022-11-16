import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import { AdminService } from 'src/admin/admin.service';
import { SuperadminService } from 'src/superadmin/superadmin.service';
import appEnvConfig from '../../../config/app-env.config';
import { SubAdminExpressRequest } from '../types/subadminExpressRequest';

@Injectable()
export class SubAdminAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService<
      ConfigType<typeof appEnvConfig>
    >,
    private readonly adminServivce: AdminService,
  ) {}

  async use(
    req: SubAdminExpressRequest,
    res: any,
    next: (error?: any) => void,
  ) {
    try {
      if (!req.headers.authorization) {
        req.subadmin = null;
        next();
        return;
      }
      const token = req.headers.authorization.split(' ')[1];
      const adminInfo = this.configService.get('admin', { infer: true });
      const decode = verify(token, adminInfo.subAdminJwtSecret);
      const adminUser = await this.adminServivce.findAdmin(
        decode['username'],
        decode['role'],
      );
      req.subadmin = adminUser;
      next();
    } catch (e) {
      req.subadmin = null;
      next();
    }
  }
}
