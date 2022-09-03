import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAccessGuard from 'src/shared/guards/jwt-access.guard';
import WrapResponseInterceptor from 'src/shared/interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import SecurityQuestionsService from './security-question.service';
import ResponseUtils from 'src/shared/utils/response.utils';
import PaginationUtils from 'src/shared/utils/pagination.utils';
import AccountEntity from '@entities/account.entity';
import User from 'src/shared/decorators/user.decorator';
import { Types, TypesEnum } from 'src/shared/decorators/types.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import CreateSecurityQuestionDto from './dto/create-security-question.dto';
import SecurityQuestionEntity from '@entities/security-question.entity';
import UpdateSecurityQuestionDto from './dto/update-security-question.dto';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class SecurityQuestionsController {
  constructor(
    private readonly securityQuestionsService: SecurityQuestionsService,
  ) { }

  @Post()
  @Types(TypesEnum.superAdmin)
  async create(@Body() securityQuestionDto: CreateSecurityQuestionDto): Promise<any> {
    const securityQuestion = await this.securityQuestionsService.create(
      securityQuestionDto,
    );

    return ResponseUtils.success('securityQuestions', {
      message: 'Success',
      securityQuestion,
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

  @Put(':id')
  @Types(TypesEnum.superAdmin)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() securityQuestion: UpdateSecurityQuestionDto): Promise<any> {
    await this.securityQuestionsService.update(id, securityQuestion);

    return ResponseUtils.success('securityQuestions', {
      message: 'Success!',
    });
  }

  @Patch(':id/set')
  @UseGuards(JwtAccessGuard)
  async set(@Param('id', ParseUUIDPipe) id: string, @User() account: AccountEntity, @Body('answer') answer: string): Promise<any> {
    await this.securityQuestionsService.set(id, account.id, answer);

    return ResponseUtils.success('securityQuestions', {
      message: 'Success!',
    });
  }
}