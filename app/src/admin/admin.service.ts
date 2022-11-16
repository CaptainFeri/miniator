import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from 'src/common/enum/userRole.enum';
import appEnvConfig from 'src/config/app-env.config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from './entity/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateAdminDto } from 'src/superadmin/dto/createAdmin.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    private readonly configService: ConfigService<
      ConfigType<typeof appEnvConfig>
    >,
    private readonly userService: UsersService,
  ) {}

  async createUser(data: CreateAdminDto, subadmin) {
    const newUser = await this.userService.createUser(data, subadmin);
    if (newUser) {
      return {
        data: newUser,
      };
    }
  }

  async generateSuperAdminToken(
    username: string,
    password: string,
    role: UserRole,
  ) {
    if (UserRole.ADMIN == role) {
      const admin = await this.adminRepo.findOne({ where: { username } });
      if (admin) {
        await bcrypt.compare(password, admin.password);
        const token = this.jwtService.sign({ username, role });
        return token;
      }
    }
    throw new BadRequestException('ADMIN.INVALID');
  }

  async findAdmin(username: string, role: UserRole) {
    const admin = await this.adminRepo.findOne({ where: { username } });
    if (admin && role == UserRole.ADMIN) return { username, role };
    throw new NotFoundException('ADMIN.NOT_FOUND');
  }
}
