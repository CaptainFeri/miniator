import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from 'src/shared/decorators/public.decorator';
import { TypesEnum } from 'src/shared/decorators/types.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class JwtAccessGuard extends AuthGuard('accessToken') {
  public constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith('Basic ')) {
      const buff = Buffer.from(authorization.slice(6), 'base64');
      const [username, password] = buff.toString('utf-8').split(':');
      if (
        username === this.config.get('SUPER_ADMIN_USERNAME') &&
        password === this.config.get('SUPER_ADMIN_PASSWORD')
      ) {
        req.user = {
          username,
          type: TypesEnum.superAdmin,
        };
        return true;
      }
    }
    return super.canActivate(context);
  }
}
