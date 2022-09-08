import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesService } from './companies.service';
import { CompanyEntity } from '@entities/company.entity';
import { CompaniesRepository } from './companies.repository';
import { CompaniesController } from './companies.controller';
import { wallet } from '../../config/wallet';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity]), wallet],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository],
  exports: [CompaniesService, CompaniesRepository],
})
export class CompaniesModule {}
