import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entity/admin.entity';
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
  ) {}

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
      const { assignTime, id, title } = services[i];
      const adminInfo = {
        username: services[i].admin.username,
        id: services[i].admin.id,
      };
      resList.push({
        assignTime,
        id,
        title,
        adminInfo,
      });
    }
    return { resList, total };
  }

  async createNewService(data: CreateServiceDto) {
    const { adminId = 0, title } = data;
    const exService = await this.serviceRepo.find({ where: { title } });
    if (exService.length > 0) {
      throw new BadRequestException('TITLE.INVALID');
    }
    const newService = new ServiceEntity();
    if (adminId != 0) {
      const admin = await this.adminRepo.findOne({ where: { id: adminId } });
      if (!admin) throw new BadRequestException('ADMIN.NOT_FOUND');
      newService.admin = admin;
    }
    newService.assignTime = new Date();
    newService.status = true;
    newService.title = title;
    return await this.serviceRepo.save(newService);
  }
}
