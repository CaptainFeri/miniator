import {
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    UseGuards,
    UseInterceptors,
    BadRequestException,
    Query,
    Post,
    Body,
    Put,
  } from '@nestjs/common';
  import JwtAccessGuard from 'src/shared/guards/jwt-access.guard';
  import WrapResponseInterceptor from 'src/shared/interceptors/wrap-response.interceptor';
  import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
  import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
  import AdminsService from './admins.service';
  import ResponseUtils from 'src/shared/utils/response.utils';
  import PaginationUtils from 'src/shared/utils/pagination.utils';
  import { Types, TypesEnum } from 'src/shared/decorators/types.decorator';
  import Serialize from 'src/shared/decorators/serialization.decorator';
  import CreateAdminDto from './dto/create-admin.dto';
  import { AllAdminsResponseEntity } from './entities/admin-response.entity';
  import AdminEntity from '@entities/admin.entity';
  import UpdateAdminDto from './dto/update-admin.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
  
  @UseInterceptors(WrapResponseInterceptor)
  @Controller()
  export default class AdminsController {
    constructor(private readonly adminsService: AdminsService) { }
  
    @Types(TypesEnum.superAdmin)
    @GrpcMethod('AdminService', 'Create')
    async create(body: CreateAdminDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
    // async create(@Body() adminDto: CreateAdminDto): Promise<any> {
      await this.adminsService.create(body);
  
      return ResponseUtils.success('admins', {
        message: 'Success',
      });
    }
  
    @UseGuards(JwtAccessGuard)
    @Types(TypesEnum.superAdmin)
    @GrpcMethod('AdminService', 'GetAll')
    async getAll(query: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
      const paginationParams: PaginationParamsInterface | false =
        PaginationUtils.normalizeParams(query.page);
      if (!paginationParams) {
        throw new BadRequestException('Invalid pagination parameters');
      }
  
      const paginatedAdmins: PaginatedEntityInterface<AdminEntity> =
        await this.adminsService.getAllWithPagination(paginationParams);
  
      return ResponseUtils.success('admins', paginatedAdmins.paginatedResult, {
        location: 'admins',
        paginationParams,
        totalCount: paginatedAdmins.totalCount,
      });
    }
  
    @GrpcMethod('AdminService', 'Update')
    @UseGuards(JwtAccessGuard)
    @Types(TypesEnum.superAdmin)
    async update(body: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
      await this.adminsService.update(body.id, body);
      return ResponseUtils.success('admins', {
        message: 'Success!',
      });
    }
  }
  