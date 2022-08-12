import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
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
import AccountEntity from '@v1/account/schemas/account.entity';
import User from '@decorators/user.decorator';
import { Types, TypesEnum } from '@decorators/types.decorator';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class SecurityQuestionsController {
  constructor(
    private readonly securityQuestionsService: SecurityQuestionsService,
  ) {}

  @Post()
  @Types(TypesEnum.superAdmin)
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
  @Types(TypesEnum.superAdmin)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() securityQuestion: UpdateSecurityQuestionDto,
  ): Promise<any> {
    await this.securityQuestionsService.update(id, securityQuestion);

    return ResponseUtils.success('securityQuestions', {
      message: 'Success!',
    });
  }

  @Get(':id/set')
  @UseGuards(JwtAccessGuard)
  async set(
    @Param('id', ParseIntPipe) id: string,
    @User() account: AccountEntity,
    @Body('answer') answer: string,
  ): Promise<any> {
    await this.securityQuestionsService.set(id, account.id, answer);

    return ResponseUtils.success('securityQuestions', {
      message: 'Success!',
    });
  }
}
