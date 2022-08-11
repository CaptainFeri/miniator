import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Query,
  Post,
  Body,
  NotFoundException,
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

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<any> {
    const role = await this.rolesService.create(createRoleDto);

    return ResponseUtils.success('roles', {
      message: 'Success',
      role,
    });
  }

  @Get()
  @UseGuards(JwtAccessGuard)
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

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseInterface> {
    const foundRole = await this.rolesService.getById(id);

    if (!foundRole) {
      throw new NotFoundException('The role does not exist');
    }

    return ResponseUtils.success('roles', foundRole);
  }

  @Post(':id')
  @UseGuards(JwtAccessGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: UpdateRoleDto,
  ): Promise<any> {
    await this.rolesService.update(id, role);

    return ResponseUtils.success('roles', {
      message: 'Success!',
    });
  }
}
