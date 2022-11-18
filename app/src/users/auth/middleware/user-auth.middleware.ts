import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
import appEnvConfig from '../../../config/app-env.config';
import { UsersService } from '../../users.service';
import { UserExpressRequest } from '../types/userExpressRequest';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService<
      ConfigType<typeof appEnvConfig>
    >,
    private readonly userService: UsersService,
  ) {}

  async use(req: UserExpressRequest, res: any, next: (error?: any) => void) {
    try {
      if (!req.headers.authorization) {
        req.user = null;
        next();
        return;
      }
      const token = req.headers.authorization.split(' ')[1];
      const userInfo =
        this.configService.get('user', {
          infer: true,
        })?.userJwtSecret || '';
      const decode = verify(token, userInfo);
      const adminUser = await this.userService.findUser(
        decode['username'],
        decode['role'],
      );
      req.user = adminUser;
      next();
    } catch (e) {
      req.user = null;
      next();
    }
  }
}
