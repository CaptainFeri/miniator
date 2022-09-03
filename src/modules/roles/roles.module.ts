import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import RolesController from './roles.controller';
import RolesService from './roles.service';
import RolesRepository from './roles.repository';
import CompanyRoleRequestEntity from '../../entities/company-role-request.entity';
import CompanyRoleEntity from '@entities/company-role.entity';
import RoleRequestsRepository from './role-request.repository';


@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyRoleRequestEntity, CompanyRoleEntity]),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, RoleRequestsRepository],
  exports: [RolesService, RolesRepository],
})
export default class RolesModule {}