import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import RolesController from './roles.controller';
import RolesService from './roles.service';
import RolesRepository from './roles.repository';
import CompanyRoleRequestEntity from '@v1/company/schemas/companyRoleRequest.entity';
import CompanyRoleEntity from '@v1/company/schemas/companyRole.entity';
import RoleRequestsRepository from '@v1/roles/role-request.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyRoleRequestEntity, CompanyRoleEntity]),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository, RoleRequestsRepository],
  exports: [RolesService, RolesRepository],
})
export default class RolesModule {}
