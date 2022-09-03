import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerUnaryCall } from '@grpc/grpc-js';

export class BasicAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const { metadata }: ServerUnaryCall<any, any> = context.getArgByIndex(2);

    const authBasic = metadata.getMap().auth_basic?.toString();

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
