import {
  BadRequestException,
  Controller,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAccessGuard } from '@guards/jwt-access.guard';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import PaginationUtils from '@utils/pagination.utils';
import { RolesService } from './roles.service';
import User from '@decorators/user.decorator';
import { AccountEntity } from '@entities/account.entity';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { Public } from '@decorators/public.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from '@/roles/dto/update-role.dto';

@Controller()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Types(TypesEnum.superAdmin)
  @MessagePattern('RolesService_Create')
  async create(@Payload() msg: any): Promise<any> {
    const data: CreateRoleDto = msg.value;
    return await this.rolesService.create(data);
  }

  @Public()
  @MessagePattern('RolesService_GetAll')
  async getAll(@Payload() msg: any) {
    const query: any = msg.value;
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
  @MessagePattern('RolesService_GetById')
  async getById(@Payload() msg: any) {
    const query: any = msg.value;
    const foundRole = await this.rolesService.getById(query.id);

    if (!foundRole) {
      throw new NotFoundException('The role does not exist');
    }

    return foundRole;
  }

  @UseGuards(JwtAccessGuard)
  @Types(TypesEnum.superAdmin)
  @MessagePattern('RolesService_Update')
  async update(@Payload() msg: any): Promise<any> {
    const body: UpdateRoleDto = msg.value;
    await this.rolesService.update(body.id, body);

    return {
      success: true,
    };
  }

  @MessagePattern('RolesService_Request')
  async request(@Payload() msg: any, @User() account: AccountEntity): Promise<any> {
    await this.rolesService.request(msg.value.id, account.id);

    return {
      success: true,
    };
  }

  @MessagePattern('WalletService_Accept')
  @Types(TypesEnum.superAdmin, TypesEnum.admin)
  async accept(@Payload() msg: any, @User() account: AccountEntity): Promise<any> {
    await this.rolesService.accept(msg.value.id, account);

    return {
      success: true,
    };
  }
}
