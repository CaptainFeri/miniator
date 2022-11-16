import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class SubadminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.subadmin) {
      return true;
    }
    
    throw new UnauthorizedException('FORBIDDEN');
  }
}
