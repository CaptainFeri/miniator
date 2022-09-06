import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class JwtRefreshGuard extends AuthGuard('refreshToken') {}

export class JwtRefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const refreshToken = context.getArgByIndex(0)['refreshToken'];
    this.jwtService.verify(refreshToken.split(' ')[1]);

    return true;
  }
}
