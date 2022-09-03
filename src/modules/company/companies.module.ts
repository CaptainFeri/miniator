import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import CompaniesService from './companies.service';
import CompanyEntity from '@entities/company.entity';
import CompaniesRepository from './companies.repository';
import CompaniesGrpcController from './companies-grpc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [CompaniesGrpcController],
  providers: [CompaniesService, CompaniesRepository],
  exports: [CompaniesService, CompaniesRepository],
})
export default class CompaniesModule {}
