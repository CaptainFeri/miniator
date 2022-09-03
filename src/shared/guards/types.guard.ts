import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtDecodeResponse } from 'src/shared/interfaces/jwt-decode-response.interface';
import { TypesEnum } from 'src/shared/decorators/types.decorator';

@Injectable()
export default class TypesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  getRequest(context: ExecutionContext) {
    return context.switchToRpc().getContext();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    // console.log(request.refreshToken);
    const type = context.getType();
    const prefix = 'Bearer ';

    let header: any;
    if (type === 'rpc') {
        const token = context.getArgByIndex(0)['auth'];
        const tokenData = (await this.jwtService.decode(
          token?.split('Bearer')[1].trim() as string,
        )) as JwtDecodeResponse | null;
        if (tokenData?.type === TypesEnum.superAdmin) {
          return true;
        }
        return true;
    }
    return true;
  }
}