import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import RolesController from './roles.controller';
import RolesService from './roles.service';
import RolesRepository from './roles.repository';
import CompanyRoleRequestEntity from '@v1/company/schemas/companyRoleRequest.entity';
import CompanyRoleEntity from '@v1/company/schemas/companyRole.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyRoleRequestEntity, CompanyRoleEntity]),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService, RolesRepository],
})
export default class RolesModule {}
