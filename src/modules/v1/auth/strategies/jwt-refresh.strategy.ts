import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import AccountEntity from '@v1/account/schemas/account.entity';

import { JwtStrategyValidate } from '../interfaces/jwt-strategy-validate.interface';

@Injectable()
export default class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('REFRESH_TOKEN') ||
        'c15476aec025be7a094f97aac6eba4f69268e706e603f9e1ec4d815396318c86',
    });
  }

  async validate(payload: AccountEntity): Promise<JwtStrategyValidate> {
    return {
      id: payload.id,
      username: payload.username,
      type: payload.type,
    };
  }
}
