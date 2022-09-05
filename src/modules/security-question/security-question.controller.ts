import { BadRequestException, Controller } from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import { SecurityQuestionsService } from './security-question.service';
import PaginationUtils from '@utils/pagination.utils';
import { AccountEntity } from '@entities/account.entity';
import User from '@decorators/user.decorator';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { Public } from '@decorators/public.decorator';
import { CreateSecurityQuestionDto } from './dto/create-security-question.dto';
import { SecurityQuestionEntity } from '@entities/security-question.entity';
import { UpdateSecurityQuestionDto } from './dto/update-security-question.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { SetSecurityQuestionDto } from './dto/set-security-question.dto';

@Controller()
export class SecurityQuestionsController {
  constructor(
    private readonly securityQuestionsService: SecurityQuestionsService,
  ) {}

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('QuestionService', 'Create')
  async Create(data: CreateSecurityQuestionDto) {
    return await this.securityQuestionsService.create(data);
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

    return {
      securityQuestions: paginatedQuestions.paginatedResult,
      totalCount: paginatedQuestions.totalCount,
    };
  }

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('QuestionService', 'Update')
  async update(body: UpdateSecurityQuestionDto) {
    await this.securityQuestionsService.update(body.id, body);

    return {
      success: true,
    };
  }

  //TODO later
  @GrpcMethod('QuestionService', 'Set')
  async set(body: SetSecurityQuestionDto, @User() account: AccountEntity) {
    await this.securityQuestionsService.set(body.id, account.id, body.answer);

    return {
      success: true,
    };
  }
}
