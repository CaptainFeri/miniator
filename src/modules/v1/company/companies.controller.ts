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
  Body, NotFoundException,
} from '@nestjs/common';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import CompaniesService from './companies.service';
import PaginationUtils from '../../../utils/pagination.utils';
import ResponseUtils from '../../../utils/response.utils';
import UpdateCompanyDto from '@v1/company/dto/update-company.dto';
import CompanyEntity from '@v1/company/schemas/company.entity';
import CreateCompanyDto from '@v1/company/dto/create-company.dto';
import { SuccessResponseInterface } from '@interfaces/success-response.interface';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
  ) {}

  @Post('')
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<any> {
    const company = await this.companiesService.create(createCompanyDto);

    return ResponseUtils.success('companies', {
      message: 'Success',
      company,
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

    const paginatedQuestions: PaginatedEntityInterface<CompanyEntity> =
      await this.companiesService.getAllWithPagination(
        paginationParams,
      );

    return ResponseUtils.success(
      'companies',
      paginatedQuestions.paginatedResult,
      {
        location: 'companies',
        paginationParams,
        totalCount: paginatedQuestions.totalCount,
      },
    );
  }

  @Get(':id')
  @UseGuards(JwtAccessGuard)
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseInterface> {
    const foundCompany = await this.companiesService.getById(id);

    if (!foundCompany) {
      throw new NotFoundException('The company does not exist');
    }

    return ResponseUtils.success('companies', foundCompany);
  }

  @Post(':id')
  @UseGuards(JwtAccessGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() company: UpdateCompanyDto,
  ): Promise<any> {
    await this.companiesService.update(id, company);

    return ResponseUtils.success('companies', {
      message: 'Success!',
    });
  }
}
