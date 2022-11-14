import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../common/enum/userRole.enum';
import { ConfigService, ConfigType } from '@nestjs/config';
import appEnvConfig from 'src/config/app-env.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SuperadminService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<
      ConfigType<typeof appEnvConfig>
    >,
  ) {}

  async hash() {
    const hash = await bcrypt.hash('superadmin', 10);
    console.log(hash);
  }

  async generateSuperAdminToken(
    username: string,
    password: string,
    role: UserRole,
  ) {
    const adminInfo = this.configService.get('admin', { infer: true });
    if (
      adminInfo.superAdminUserName == username &&
      (await bcrypt.compare(password, adminInfo.superAdminPasswordHash))
    ) {
      const token = this.jwtService.sign({ username, role });
      return token;
    } else {
      throw new BadRequestException('USER.INVALID');
    }
  }

  async findSuperAdmin(username: string, role: UserRole) {
    const superadminInfo = this.configService.get('admin', { infer: true });
    if (
      superadminInfo.superAdminUserName == username &&
      role == UserRole.SUPERADMIN
    ) {
      const admin = { username, role };
      return admin;
    } else {
      throw new NotFoundException('ADMIN.NOT_FOUND');
    }
  }
}
