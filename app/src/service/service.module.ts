import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '../admin/entity/admin.entity';
import { UserEntity } from '../users/entity/users.entity';
import { ServiceEntity } from './entity/service.entity';
import { ServiceService } from './service.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity, AdminEntity, UserEntity])],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
