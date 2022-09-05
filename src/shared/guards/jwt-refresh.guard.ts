import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class JwtRefreshGuard extends AuthGuard('refreshToken') {}

export class JwtRefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  getRequest(context: ExecutionContext) {
    return context.switchToRpc().getContext();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request = this.getRequest(context);
    // console.log(request.refreshToken);
    const type = context.getType();
    if (type === 'rpc') {
      const refreshToken = context.getArgByIndex(0)['refreshToken'];
      const status = this.jwtService.verify(refreshToken.split(' ')[1]);
      console.log(status);
    }

    return true;
  }
}
