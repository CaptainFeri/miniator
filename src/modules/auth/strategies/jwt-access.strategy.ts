import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategyValidate } from '../interfaces/jwt-strategy-validate.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'accessToken',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SECRET'),
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
