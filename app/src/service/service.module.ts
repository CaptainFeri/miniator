import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entity/admin.entity';
import { ServiceEntity } from './entity/service.entity';
import { ServiceService } from './service.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity, AdminEntity])],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
