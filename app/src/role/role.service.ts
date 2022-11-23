import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssignRoleServiceDto } from 'src/subadmin/dto/assign-role-service.dto';
import { AdminEntity } from 'src/subadmin/entity/admin.entity';
import { ServiceEntity } from 'src/service/entity/service.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleEntity } from './entity/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
  ) {}

  async updateRole(data: CreateRoleDto, id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('ROLE.NOT_FOUND');
    role.title = data.title;
    role.vip = data.vip;
    return await this.roleRepo.save(role);
  }

  async getAllRoles(take: number, skip: number) {
    const [roles, total] = await this.roleRepo.findAndCount({
      take,
      skip,
    });
    return {
      roles,
      total,
    };
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
    console.log(serviceAdmin);
    if (exRole.length > 0) throw new BadRequestException('BAD_REQUEST');
    if (!serviceAdmin) throw new NotFoundException('ADMIN.NOT_FOUND');
    const newRole = new RoleEntity();
    newRole.title = data.title;
    newRole.vip = data.vip;
    newRole.createBy = subadmin;
    newRole.service = serviceAdmin;
    return await this.roleRepo.save(newRole);
  }
}
