import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';
import ResponseUtils from '../../../utils/response.utils';
import PaginationUtils from '../../../utils/pagination.utils';
import RolesService from './roles.service';
import UpdateRoleDto from '@v1/roles/dto/update-role.dto';
import CreateRoleDto from '@v1/roles/dto/create-role.dto';
import User from '@decorators/user.decorator';
import AccountEntity from '@v1/account/schemas/account.entity';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { Public } from '@decorators/public.decorator';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Types(TypesEnum.superAdmin)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<any> {
    const role = await this.rolesService.create(createRoleDto);

    return ResponseUtils.success('roles', {
      message: 'Success',
      role,
    });
  }

  @Public()
  @Get()
  async getAll(@Query() query: any) {
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
  @Get(':id')
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponseInterface> {
    const foundRole = await this.rolesService.getById(id);

    if (!foundRole) {
      throw new NotFoundException('The role does not exist');
    }

    return ResponseUtils.success('roles', foundRole);
  }

  @Post(':id')
  @UseGuards(JwtAccessGuard)
  @Types(TypesEnum.superAdmin)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() role: UpdateRoleDto,
  ): Promise<any> {
    await this.rolesService.update(id, role);

    return ResponseUtils.success('roles', {
      message: 'Success!',
    });
  }

  @Get(':id/request')
  async request(
    @Param('id', ParseUUIDPipe) id: string,
    @User() account: AccountEntity,
  ): Promise<any> {
    await this.rolesService.request(id, account.id);

    return ResponseUtils.success('roleRequests', {
      message: 'Success!',
    });
  }

  @Get(':id/accept')
  @Types(TypesEnum.superAdmin, TypesEnum.admin)
  async accept(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    await this.rolesService.accept(id);

    return ResponseUtils.success('roleRequests', {
      message: 'Success!',
    });
  }
}
