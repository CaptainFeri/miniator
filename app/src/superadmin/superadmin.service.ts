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
import { CreateAdminDto } from './dto/createAdmin.dto';
import { Repository } from 'typeorm';
import { AdminEntity } from 'src/admin/entity/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SuperadminService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<
      ConfigType<typeof appEnvConfig>
    >,
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
  ) {}

  async getAdmins(take: number, skip: number) {
    if (take < 0 || skip < 0) throw new BadRequestException('BAD_REQUEST');
    const [admins, total] = await this.adminRepo.findAndCount({
      take,
      skip,
      select: ['id', 'username'],
      order: {
        createAt: 'DESC',
      },
    });
    for (let i = 0; i < admins.length; i++) {
      delete admins[i].password;
    }
    return { admins, total };
  }

  async createNewAdmin(data: CreateAdminDto) {
    const { username, password } = data;
    const existAdmin = await this.adminRepo.findOne({ where: { username } });
    if (existAdmin) throw new BadRequestException('ADMIN.ALREADY_EXISTS');
    const newAdmin = new AdminEntity();
    newAdmin.username = username;
    newAdmin.password = (await bcrypt.hash(password, 10)).toString();
    return await this.adminRepo.save(newAdmin);
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
