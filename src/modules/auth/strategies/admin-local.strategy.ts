import { Strategy } from 'passport-local';
import { validate } from 'class-validator';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import SignInDto from '../dto/sign-in.dto';
import { ValidateAccountOutput } from '../interfaces/validate-account-output.interface';

import AuthService from '../auth.service';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    username: string,
    password: string,
  ): Promise<ValidateAccountOutput> {
    const errors = await validate(new SignInDto(req.body));

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    const admin = await this.authService.validateAdmin(username, password);

    if (!admin) {
      throw new UnauthorizedException();
    }

    return admin;
  }
}
