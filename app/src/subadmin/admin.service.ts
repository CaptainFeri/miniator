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
import { ServiceEntity } from 'src/service/entity/service.entity';
import { RoleEntity } from 'src/role/entity/role.entity';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { AssignRoleServiceDto } from './dto/assign-role-service.dto';
import { ServiceService } from 'src/service/service.service';
import { SecurityQService } from 'src/security-q/security-q.service';
import { createSecurityQuestionDto } from 'src/security-q/dto/security-question.dto';
import { RoleService } from 'src/role/role.service';
import { UserFilterDto } from 'src/superadmin/user-managment/dto/get-user.dto';

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
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
    private readonly serviceService: ServiceService,
    private readonly roleService: RoleService,
  ) {}

  async getUsers(data: UserFilterDto) {
    const users = await this.userService.getUserFilter(data);
    return users;
  }

  async updateRole(data: CreateRoleDto, id: number) {
    return await this.roleService.updateRole(data, id);
  }

  async getAllRoles(take: number, skip: number) {
    return await this.roleService.getAllRoles(take, skip);
  }

  async getUsersOfService(id: number) {
    return await this.serviceService.getUsersOfServiceById(id);
  }

  async getRoles(username: string) {
    return await this.roleService.getRoles(username);
  }

  async getRolesOfService(serviceId: number) {
    return await this.roleService.getRolesOfService(serviceId);
  }

  async assignRoleServie(data: AssignRoleServiceDto, subadmin: string) {
    return await this.roleService.assignRoleServie(data, subadmin);
  }

  async createNewRole(data: CreateRoleDto, subadmin: string) {
    return await this.roleService.createNewRole(data, subadmin);
  }

  async getServices(admin, take: number, skip: number) {
    const subadmin = await this.adminRepo.findOne({
      where: { username: admin['username'] },
    });
    const [services, total] = await this.serviceRepo.findAndCount({
      where: {
        admin: {
          id: subadmin.id,
        },
      },
      take,
      skip,
      order: {
        createAt: 'DESC',
      },
    });
    const res = [];
    for (let i = 0; i < services.length; i++) {
      const { assignTime, status, title, id, roles } = services[i];
      res.push({ assignTime, title, status, id, roles });
    }
    return { res, total };
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
