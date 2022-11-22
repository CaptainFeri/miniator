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
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    private readonly serviceService: ServiceService,
    private readonly securityQservice: SecurityQService,
  ) {}

  async getQuestions() {
    return await this.securityQservice.getQuestions();
  }

  async createSecurityQuestion(data: createSecurityQuestionDto) {
    return await this.securityQservice.insertNewSecurityQuestion(data);
  }

  async getUsersOfService(id: number) {
    return await this.serviceService.getUsersOfServiceById(id);
  }

  async getRoles(username: string) {
    const admin = await this.adminRepo.findOne({
      where: { username },
      relations: ['services'],
    });
    if (admin) {
      return await this.roleRepo.find();
    }
    throw new NotFoundException('ADMIN.NOT_FOUND');
  }

  async getRolesOfService(serviceId: number) {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['roles'],
    });
    if (service) return service;
    throw new NotFoundException('SERVICE.NOT_FOUND');
  }

  async assignRoleServie(data: AssignRoleServiceDto, subadmin: string) {
    const { roleId, serviceId } = data;
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('ROLE.NOT_FOUND');
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['roles'],
    });
    if (!service) throw new NotFoundException('SERVICE.NOT_FOUND');
    if (role.createBy == subadmin && service.admin.username == subadmin) {
      service.roles.forEach((r) => {
        if (r.id == role.id) throw new BadRequestException('BAD_REQUEST');
      });
      service.roles.push(role);
      await this.serviceRepo.save(service);
      return service.roles;
    } else {
      throw new BadRequestException('BAD_REQUEST');
    }
  }

  async createNewRole(data: CreateRoleDto, subadmin: string) {
    const exRole = await this.roleRepo.find({
      where: { title: data.title },
    });
    const serviceAdmin = await this.serviceRepo.findOne({
      where: { admin: { username: subadmin } },
      relations: ['roles'],
    });
    if (exRole.length > 0) throw new BadRequestException('BAD_REQUEST');
    if (!serviceAdmin) throw new NotFoundException('ADMIN.NOT_FOUND');
    const newRole = new RoleEntity();
    newRole.title = data.title;
    newRole.vip = data.vip;
    newRole.createBy = subadmin;
    await this.roleRepo.save(newRole);
    serviceAdmin.roles.push(newRole);
    return await this.serviceRepo.save(serviceAdmin);
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
