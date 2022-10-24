import {
  Controller,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from '@/account/accounts.service';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import authConstants from './constants/auth-constants';
import { AdminsService } from '@/admin/admins.service';
import { VerifyAccountTokenDto } from './dto/verify-account.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminSignInDto } from '@/auth/dto/admin-sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly accountsService: AccountsService,
    private readonly adminService: AdminsService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @MessagePattern('AuthService_Login')
  async Login(@Payload() msg: any) {
    const data: SignInDto = msg.value;
    const login = await this.authService.validateAccount(
      data.username,
      data.password,
    );

    if (!login) {
      throw new UnauthorizedException();
    }

    return await this.authService.login(
      await this.authService.createPayload(login.id, data),
    );
  }

  @MessagePattern('AuthService_LoginAdmin')
  async LoginAdmin(@Payload() msg: any) {
    const data: AdminSignInDto = msg.value;
    const login = await this.adminService.login(data.username, data.password);

    if (!login.status) {
      throw new UnauthorizedException();
    }

    const user = {
      username: login.username,
      id: login.id,
      type: login.type,
    };

    return await this.authService.login(user);
  }

  @MessagePattern('AuthService_RefreshToken')
  async RefreshToken(@Payload() msg: any) {
    const data: RefreshTokenDto = msg.value;
    const payload = await this.jwtService.verifyAsync(data.refreshToken, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
    });
    return {
      token: await this.authService.accessToken(payload),
    };
  }

  @MessagePattern('AuthService_SignUp')
  async SignUp(@Payload() msg: any) {
    const data: SignUpDto = msg.value;
    const { id } = await this.accountsService.create(data);
    const token = this.authService.createVerifyToken(id);

    // await this.mailerService.sendMail({
    //   to: email,
    //   from: this.configService.get<string>('MAILER_FROM_EMAIL'),
    //   subject: authConstants.mailer.verifyEmail.subject,
    //   template: `${process.cwd()}/src/templates/verify-password`,
    //   context: {
    //     token,
    //     email,
    //     host: this.configService.get('HOST'),
    //   },
    // });
    return {
      success: true,
      token,
    };
  }

  @MessagePattern('AuthService_Verify')
  async Verify(@Payload() msg: any) {
    const data: VerifyAccountTokenDto = msg.value;
    const { id } = await this.authService.verifyEmailVerToken(
      data.token,
      this.configService.get<string>(
        'ACCESS_SECRET',
        authConstants.jwt.secrets.accessToken,
      ),
    );
    const foundAccount = await this.accountsService.getUnverifiedAccountById(
      id,
    );
    if (!foundAccount) {
      throw new NotFoundException('The user does not exist');
    }

    await this.authService.addUserToRedis(foundAccount);

    await this.accountsService.verify(foundAccount.id);

    return {
      success: true,
    };
  }
}
