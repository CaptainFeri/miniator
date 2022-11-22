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
import { ServiceService } from 'src/service/service.service';
import { CreateServiceDto } from 'src/service/dto/create-service.dto';
import { AssignAdminServiceDto } from 'src/service/dto/assign-admin-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class SuperadminService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<
      ConfigType<typeof appEnvConfig>
    >,
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    private readonly serviceService: ServiceService,
  ) {}

  async updateService(id: number, data: UpdateServiceDto) {
    return await this.serviceService.updateService(id, data);
  }

  // async assignAdminService(data: AssignAdminServiceDto) {
  //   const assign = await this.serviceService.assignAdminService(data);
  //   return assign;
  // }

  async getServices(take: number, skip: number) {
    const services = await this.serviceService.getServices(take, skip);
    return services;
  }

  async createNewService(data: CreateServiceDto) {
    const newService = await this.serviceService.createNewService(data);
    return newService;
  }

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
    const { username, password, serviceId } = data;
    const existAdmin = await this.adminRepo.findOne({ where: { username } });
    if (existAdmin) throw new BadRequestException('ADMIN.ALREADY_EXISTS');
    const service = await this.serviceService.getServiceById(serviceId);
    const newAdmin = new AdminEntity();
    newAdmin.username = username;
    newAdmin.password = (await bcrypt.hash(password, 10)).toString();
    await this.adminRepo.save(newAdmin);
    service.admin = newAdmin;
    service.status = true;
    await this.serviceService.saveService(service);
    return newAdmin;
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
      throw new BadRequestException('ADMIN.INVALID');
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
