import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import JwtAccessGuard from '@guards/jwt-access.guard';
  import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
  import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
  import { SuccessResponseInterface } from '@interfaces/success-response.interface';
  import ResponseUtils from '@utils/response.utils';
  import PaginationUtils from '@utils/pagination.utils';
  import RolesService from './roles.service';
  import User from '@decorators/user.decorator';
  import AccountEntity from '@entities/account.entity';
  import { Types, TypesEnum } from '@decorators/types.decorator';
  import { Public } from '@decorators/public.decorator';
  import CreateRoleDto from './dto/create-role.dto';
  import UpdateRoleDto from './dto/update-role.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
  
  @UseInterceptors(WrapResponseInterceptor)
  @Controller()
  export default class RolesController {
    constructor(private readonly rolesService: RolesService) { }
  
    @Types(TypesEnum.superAdmin)
    @GrpcMethod('RolesService', 'Create')
    async create(data: CreateRoleDto, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
      const role = await this.rolesService.create(data);
  
      return ResponseUtils.success('roles', {
        message: 'Success',
        role,
      });
    }
  
    @Public()
    @GrpcMethod('RolesService', 'GetAll')
    async getAll(query: any, metadata: Metadata, call: ServerUnaryCall<any, any>) {
      const paginationParams: PaginationParamsInterface | false =
        PaginationUtils.normalizeParams(query.page);
      if (!paginationParams) {
        throw new BadRequestException('Invalid pagination parameters');
      }
  
      const paginatedRoles = await this.rolesService.getAllWithPagination(
        paginationParams,
      );
  
      return ResponseUtils.success('roles', paginatedRoles.paginatedResult, {
        location: 'roles',
        paginationParams,
        totalCount: paginatedRoles.totalCount,
      });
    }
  
    @Public()
    @GrpcMethod('RolesService', 'GetItem')
    async getById(query: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<SuccessResponseInterface> {
      const foundRole = await this.rolesService.getById(query.id);
  
      if (!foundRole) {
        throw new NotFoundException('The role does not exist');
      }
  
      return ResponseUtils.success('roles', foundRole);
    }
  
    @UseGuards(JwtAccessGuard)
    @Types(TypesEnum.superAdmin)
    @GrpcMethod('RolesService', 'Update')
    async update(body: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
      await this.rolesService.update(body.id, body);
  
      return ResponseUtils.success('roles', {
        message: 'Success!',
      });
    }
  
    @GrpcMethod('RolesService', 'Request')
    async request(body: any, metadata: Metadata, call: ServerUnaryCall<any, any>,@User() account: AccountEntity): Promise<any> {
      await this.rolesService.request(body.id, account.id);
      return ResponseUtils.success('roleRequests', {
        message: 'Success!',
      });
    }
  
    @GrpcMethod('WalletService', 'Accept')
    @Types(TypesEnum.superAdmin, TypesEnum.admin)
    async accept(body: any, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<any> {
      await this.rolesService.accept(body.IsDateString);
      return ResponseUtils.success('roleRequests', {
        message: 'Success!',
      });
    }
  }
