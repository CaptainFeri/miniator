import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class BasicAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authBasic = request.headers.auth_basic;
    if (!authBasic || !authBasic.startsWith('Basic ')) {
      return false;
    }

    const buff = new Buffer(authBasic.slice(6), 'base64');
    const [username, password] = buff.toString('utf-8').split(':');

    return (
      username === this.config.get('BASIC_AUTH_USERNAME') &&
      password === this.config.get('BASIC_AUTH_PASSWORD')
    );
  }
}