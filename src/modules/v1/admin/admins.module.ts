import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AdminsController from './admins.controller';
import AdminsService from './admins.service';
import AdminEntity from './schemas/admin.entity';
import AdminsRepository from './admins.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminsController],
  providers: [AdminsService, AdminsRepository],
  exports: [AdminsService, AdminsRepository],
})
export default class AdminsModule {}
