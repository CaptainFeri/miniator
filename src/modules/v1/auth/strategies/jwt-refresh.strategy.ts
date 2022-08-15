import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtStrategyValidate } from '../interfaces/jwt-strategy-validate.interface';

@Injectable()
export default class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshToken',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('REFRESH_SECRET'),
    });
  }

  async validate(payload): Promise<JwtStrategyValidate> {
    return {
      id: payload.id,
      username: payload.username,
      type: payload.type,
    };
  }
}
