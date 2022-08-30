import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import CompaniesController from './companies.controller';
import CompaniesService from './companies.service';
import CompanyEntity from '@entities/company.entity';
import CompaniesRepository from './companies.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository],
  exports: [CompaniesService, CompaniesRepository],
})
export default class CompaniesModule {}
