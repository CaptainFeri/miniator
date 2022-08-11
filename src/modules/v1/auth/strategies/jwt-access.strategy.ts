import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import AccountEntity from '@v1/account/schemas/account.entity';

import { JwtStrategyValidate } from '../interfaces/jwt-strategy-validate.interface';
import authConstants from '@v1/auth/auth-constants';

@Injectable()
export default class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'ACCESS_SECRET',
        authConstants.jwt.secrets.accessToken,
      ),
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
