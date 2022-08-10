import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import CompaniesController from './companies.controller';
import CompaniesService from './companies.service';
import CompanyEntity from './schemas/company.entity';
import CompanyRoleEntity from './schemas/companyRole.entity';
import CompanyRoleRequestEntity from './schemas/companyRoleRequest.entity';
import CompaniesRepository from './companies.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyEntity,
      CompanyRoleRequestEntity,
      CompanyRoleEntity,
    ]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository],
  exports: [CompaniesService, CompaniesRepository],
})
export default class CompaniesModule {}
