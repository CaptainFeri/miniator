import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
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
import { SetSecurityQuestionDto } from './dto/set-security-question.dto';

@Controller()
export class SecurityQuestionsController {
  constructor(
    private readonly securityQuestionsService: SecurityQuestionsService,
  ) {}

  @Types(TypesEnum.superAdmin)
  @MessagePattern('QuestionService_Create')
  async Create(@Payload() msg: any) {
    const data: CreateSecurityQuestionDto = msg.value;
    return await this.securityQuestionsService.create(data);
  }

  @Public()
  @MessagePattern('QuestionService_GetAll')
  async getAll(@Payload() msg: any) {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(msg.value.page);
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
  @MessagePattern('QuestionService_Update')
  async update(@Payload() msg: any) {
    const body: UpdateSecurityQuestionDto = msg.value;
    await this.securityQuestionsService.update(body.id, body);

    return {
      success: true,
    };
  }

  //TODO later
  @MessagePattern('QuestionService_Set')
  async set(
    @Payload() msg: any,
    @User() account: AccountEntity
  ) {
    const body: SetSecurityQuestionDto = msg.value;
    await this.securityQuestionsService.set(body.id, account.id, body.answer);

    return {
      success: true,
    };
  }
}
