import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import AdminsService from './admins.service';
import AdminEntity from '@entities/admin.entity';
import AdminsRepository from './admins.repository';
import AdminsGrpcController from './admins-grpc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminsGrpcController],
  providers: [AdminsService, AdminsRepository],
  exports: [AdminsService, AdminsRepository],
})
export default class AdminsModule {}
