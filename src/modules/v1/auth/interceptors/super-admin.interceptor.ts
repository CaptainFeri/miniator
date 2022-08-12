import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { TypesEnum } from '@decorators/types.decorator';

export class SuperAdminInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;
    if (authorization && authorization.startsWith('Basic ')) {
      const buff = new Buffer(authorization.slice(6), 'base64');
      const [username, password] = buff.toString('utf-8').split(':');
      if (
        username === this.config.get('SUPER_ADMIN_USERNAME') &&
        password === this.config.get('SUPER_ADMIN_PASSWORD')
      ) {
        request.user = {
          username,
          type: TypesEnum.superAdmin,
        };
      }
    }

    return next.handle();
  }
}
