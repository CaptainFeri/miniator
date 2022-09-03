import {
    Controller,
    Get,
    Param,
    UseInterceptors,
    BadRequestException,
    Query,
    Post,
    Body,
    NotFoundException,
    ParseUUIDPipe,
    Put,
  } from '@nestjs/common';
  import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
  import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
  import { SuccessResponseInterface } from '@interfaces/success-response.interface';
  import ResponseUtils from '@utils/response.utils';
  import PaginationUtils from '@utils/pagination.utils';
  import CompaniesService from './companies.service';
  import { Types, TypesEnum } from '@decorators/types.decorator';
  import CreateCompanyDto from './dto/create-company.dto';
  import UpdateCompanyDto from './dto/update-company.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

  @UseInterceptors(WrapResponseInterceptor)
  @Controller()
  export default class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }


    @Types(TypesEnum.superAdmin)
    @GrpcMethod('ComponyService', 'Create')
    async create(body: CreateCompanyDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
      const company = await this.companiesService.create(body);

      return ResponseUtils.success('companies', {
        message: 'Success',
        company,
      });
    }

    @GrpcMethod('ComponyService', 'GetAll')
    async getAll(query: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
      const paginationParams: PaginationParamsInterface | false =
        PaginationUtils.normalizeParams(query.page);
      if (!paginationParams) {
        throw new BadRequestException('Invalid pagination parameters');
      }

      const paginatedCompanies = await this.companiesService.getAllWithPagination(
        paginationParams,
      );

      return ResponseUtils.success(
        'companies',
        paginatedCompanies.paginatedResult,
        {
          location: 'companies',
          paginationParams,
          totalCount: paginatedCompanies.totalCount,
        },
      );
    }

    @GrpcMethod('ComponyService', 'GetItem')
    async getById(body: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
      const foundCompany = await this.companiesService.getById(body.id);

      if (!foundCompany) {
        throw new NotFoundException('The company does not exist');
      }

      return ResponseUtils.success('companies', foundCompany);
    }

    @Types(TypesEnum.superAdmin)
    @GrpcMethod('CompaniesService', 'Update')
    async update(body: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
      await this.companiesService.update(body.id, body);

      return ResponseUtils.success('companies', {
        message: 'Success!',
      });
    }
  }
