import {
  BadRequestException,
  Controller,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from '@guards/jwt-access.guard';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import PaginationUtils from '@utils/pagination.utils';
import { RolesService } from './roles.service';
import User from '@decorators/user.decorator';
import { AccountEntity } from '@entities/account.entity';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { Public } from '@decorators/public.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { UpdateRoleDto } from '@/roles/dto/update-role.dto';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('RolesService', 'Create')
  async create(data: CreateRoleDto): Promise<any> {
    return await this.rolesService.create(data);
  }

  @Public()
  @GrpcMethod('RolesService', 'GetAll')
  async getAll(query: any) {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedRoles = await this.rolesService.getAllWithPagination(
      paginationParams,
    );

    return {
      roles: paginatedRoles.paginatedResult,
      totalCount: paginatedRoles.totalCount,
    };
  }

  @Public()
  @GrpcMethod('RolesService', 'GetById')
  async getById(query: any) {
    const foundRole = await this.rolesService.getById(query.id);

    if (!foundRole) {
      throw new NotFoundException('The role does not exist');
    }

    return foundRole;
  }

  @UseGuards(JwtAccessGuard)
  @Types(TypesEnum.superAdmin)
  @GrpcMethod('RolesService', 'Update')
  async update(body: UpdateRoleDto): Promise<any> {
    await this.rolesService.update(body.id, body);

    return {
      success: true,
    };
  }

  @GrpcMethod('RolesService', 'Request')
  async request(body: any, @User() account: AccountEntity): Promise<any> {
    await this.rolesService.request(body.id, account.id);

    return {
      success: true,
    };
  }

  @GrpcMethod('WalletService', 'Accept')
  @Types(TypesEnum.superAdmin, TypesEnum.admin)
  async accept(body: any, @User() account: AccountEntity): Promise<any> {
    await this.rolesService.accept(body.id, account);

    return {
      success: true,
    };
  }
}
