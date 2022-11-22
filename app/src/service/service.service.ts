import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entity/admin.entity';
import { UpdateServiceDto } from 'src/superadmin/dto/update-service.dto';
import { UserEntity } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { AssignAdminServiceDto } from './dto/assign-admin-service.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceEntity } from './entity/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getServiceById(id: number) {
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new NotFoundException('SERVICE.NOT_FOUND');
    return service;
  }

  async saveService(service: ServiceEntity) {
    return await this.serviceRepo.save(service);
  }

  async assignAdminService(data: AssignAdminServiceDto) {
    const { adminId, serviceId } = data;
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) throw new BadRequestException('ADMIN.NOT_FOUND');
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
    });
    if (!service) throw new BadRequestException('SERVICE.NOT_FOUND');
    service.admin = admin;
    service.assignTime = new Date();
    return await this.serviceRepo.save(service);
  }

  async getServices(take: number, skip: number) {
    if (take < 0 || skip < 0) throw new BadRequestException('BAD_REQUEST');
    const [services, total] = await this.serviceRepo.findAndCount({
      take,
      skip,
      order: {
        createAt: 'DESC',
      },
      relations: ['admin'],
    });
    const resList = [];
    for (let i = 0; i < services.length; i++) {
      const {
        assignTime,
        id,
        title,
        admin,
        maxCapacity,
        maxDeposit,
        maxWithdrawal,
        minDeposit,
        minWithdrawal,
      } = services[i];
      if (admin) {
        const adminInfo = {
          username: admin.username,
          id: admin.id,
        };
        resList.push({
          assignTime,
          id,
          title,
          adminInfo,
          settings: {
            maxCapacity,
            minDeposit,
            maxDeposit,
            minWithdrawal,
            maxWithdrawal,
          },
        });
      }
    }
    return { resList, total };
  }

  async getUserServices() {
    const resList = [];
    const services = await this.serviceRepo.find({ relations: ['users'] });
    for (let i = 0; i < services.length; i++) {
      const { id, title, status } = services[i];
      resList.push({ id, title, status });
    }
    return resList;
  }

  async getAllServices() {
    return await this.serviceRepo.find({ relations: ['users'] });
  }

  async getUsersOfServiceById(serviceId: number) {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['users'],
    });
    if (service) {
      return service.users.filter((u) => delete u.password);
    }
    throw new BadRequestException('SERVICE.NOT_FOUND');
  }

  async updateService(id: number, data: UpdateServiceDto) {
    const {
      title,
      maxCapacity = 0,
      maxDeposit = 0,
      maxWithdrawal = 0,
      minWithdrawal = 0,
      minDeposit = 0,
    } = data;
    const service = await this.serviceRepo.findOne({ where: { id } });
    if (!service) throw new BadRequestException('SERVICE.NOT_FOUND');
    service.title = title;
    if (maxCapacity != 0) service.maxCapacity = maxCapacity;
    if (maxDeposit != 0) service.maxDeposit = maxDeposit;
    if (maxWithdrawal != 0) service.maxWithdrawal = maxWithdrawal;
    if (minDeposit != 0) service.minDeposit = minDeposit;
    if (minWithdrawal != 0) service.minWithdrawal = minWithdrawal;
    return await this.serviceRepo.save(service);
  }

  async createNewService(data: CreateServiceDto) {
    const {
      title,
      maxCapacity,
      maxDeposit,
      maxWithdrawal,
      minDeposit,
      minWithdrawal,
    } = data;
    const exService = await this.serviceRepo.find({ where: { title } });
    if (exService.length > 0) {
      throw new BadRequestException('TITLE.INVALID');
    }
    const newService = new ServiceEntity();

    const users = await this.userRepo.find({ relations: ['services'] });
    newService.assignTime = new Date();
    newService.status = false;
    newService.title = title;
    newService.maxCapacity = maxCapacity;
    newService.maxDeposit = maxDeposit;
    newService.maxWithdrawal = maxWithdrawal;
    newService.minDeposit = minDeposit;
    newService.minWithdrawal = minWithdrawal;
    await this.serviceRepo.save(newService);
    for (let i = 0; i < users.length; i++) {
      users[i].services.push(newService);
      await this.userRepo.save(users[i]);
    }
    return newService;
  }
}
