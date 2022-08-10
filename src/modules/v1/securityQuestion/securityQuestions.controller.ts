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
} from '@nestjs/common';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import SecurityQuestionEntity from '@v1/securityQuestion/schemas/securityQuestion.entity';
import UpdateSecurityQuestionDto from '@v1/securityQuestion/dto/update-securityQuestion.dto';
import CreateSecurityQuestionDto from '@v1/securityQuestion/dto/create-securityQuestion.dto';
import SecurityQuestionsService from './securityQuestions.service';
import PaginationUtils from '../../../utils/pagination.utils';
import ResponseUtils from '../../../utils/response.utils';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class SecurityQuestionsController {
  constructor(
    private readonly securityQuestionsService: SecurityQuestionsService,
  ) {}

  @Post('')
  async create(
    @Body() securityQuestionDto: CreateSecurityQuestionDto,
  ): Promise<any> {
    const securityQuestion = await this.securityQuestionsService.create(
      securityQuestionDto,
    );

    return ResponseUtils.success('securityQuestions', {
      message: 'Success',
      securityQuestion,
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

    const paginatedQuestions: PaginatedEntityInterface<SecurityQuestionEntity> =
      await this.securityQuestionsService.getAllWithPagination(
        paginationParams,
      );

    return ResponseUtils.success(
      'securityQuestions',
      paginatedQuestions.paginatedResult,
      {
        location: 'securityQuestions',
        paginationParams,
        totalCount: paginatedQuestions.totalCount,
      },
    );
  }

  @Post(':id')
  @UseGuards(JwtAccessGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() securityQuestion: UpdateSecurityQuestionDto,
  ): Promise<any> {
    await this.securityQuestionsService.update(id, securityQuestion);

    return ResponseUtils.success('securityQuestions', {
      message: 'Success!',
    });
  }
}
