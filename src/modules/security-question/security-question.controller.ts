import {
  BadRequestException,
  Controller,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import SecurityQuestionsService from './security-question.service';
import ResponseUtils from '@utils/response.utils';
import PaginationUtils from '@utils/pagination.utils';
import AccountEntity from '@entities/account.entity';
import User from '@decorators/user.decorator';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { Public } from '@decorators/public.decorator';
import CreateSecurityQuestionDto from './dto/create-security-question.dto';
import SecurityQuestionEntity from '@entities/security-question.entity';
import UpdateSecurityQuestionDto from './dto/update-security-question.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { SetSecurityQuestionDto } from './dto/set-security-question.dto';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class SecurityQuestionsGrpcController {
  constructor(
    private readonly securityQuestionsService: SecurityQuestionsService,
  ) {}

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('QuestionService', 'Create')
  async Create(data: CreateSecurityQuestionDto) {
    const securityQuestion = await this.securityQuestionsService.create(data);

    console.log(securityQuestion);
    return ResponseUtils.success('securityQuestions', {
      message: 'Success',
      securityQuestion,
    });
  }

  @Public()
  @GrpcMethod('QuestionService', 'GetAll')
  async getAll(query: any) {
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

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('QuestionService', 'Update')
  async update(body: UpdateSecurityQuestionDto) {
    await this.securityQuestionsService.update(body.id, body);
    return ResponseUtils.success('securityQuestions', {
      message: 'Success!',
    });
  }

  //TODO later
  @GrpcMethod('QuestionService', 'Set')
  @UseGuards(JwtAccessGuard)
  async set(body: SetSecurityQuestionDto, @User() account: AccountEntity) {
    await this.securityQuestionsService.set(body.id, account.id, body.answer);
    return ResponseUtils.success('securityQuestions', {
      message: 'Success!',
    });
  }
}
