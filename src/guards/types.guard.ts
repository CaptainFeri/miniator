import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtDecodeResponse } from '@interfaces/jwt-decode-response.interface';
import { TypesEnum } from '@decorators/types.decorator';

@Injectable()
export default class TypesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const types = this.reflector.get<string[]>('types', context.getHandler());
    if (!types) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const tokenData = (await this.jwtService
      .decode(request.headers.authorization?.split('Bearer')[1].trim() as string) as JwtDecodeResponse | null);
    if (tokenData?.type === TypesEnum.admin) {
      return true;
    }
    return !tokenData ? false : types.includes(tokenData?.type);
  }
}
