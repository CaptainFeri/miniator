import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import PaginationUtils from '@utils/pagination.utils';
import CreateSecurityQuestionDto from '@v1/securityQuestion/dto/create-securityQuestion.dto';
import UpdateSecurityQuestionDto from './dto/update-securityQuestion.dto';
import SecurityQuestionEntity from './schemas/securityQuestion.entity';
import SecurityQuestionAnswerEntity from '@v1/account/schemas/securityQuestionAnswer.entity';

@Injectable()
export default class SecurityQuestionsRepository {
  constructor(
    @InjectRepository(SecurityQuestionEntity)
    private readonly securityQuestionsModel: Repository<SecurityQuestionEntity>,
    private readonly securityQuestionAnswersModel: Repository<SecurityQuestionAnswerEntity>,
  ) {}

  public create(
    securityQuestion: CreateSecurityQuestionDto,
  ): Promise<SecurityQuestionEntity> {
    return this.securityQuestionsModel.save({
      ...securityQuestion,
    });
  }

  public async getById(
    id: string,
  ): Promise<SecurityQuestionEntity | undefined> {
    return this.securityQuestionsModel.findOne(id);
  }

  public updateById(
    id: string,
    data: UpdateSecurityQuestionDto,
  ): Promise<UpdateResult> {
    return this.securityQuestionsModel.update(id, data);
  }

  set(
    id: string,
    userId: string,
    answer: string,
  ): Promise<SecurityQuestionAnswerEntity> {
    return this.securityQuestionAnswersModel.save({
      accountEntity: {
        id: userId,
      },
      securityQuestionEntity: {
        id: userId,
      },
      answer,
    });
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<SecurityQuestionEntity>> {
    const [questions, totalCount] = await Promise.all([
      this.securityQuestionsModel.find({
        skip: PaginationUtils.getSkipCount(options.page, options.limit),
        take: PaginationUtils.getLimitCount(options.limit),
      }),
      this.securityQuestionsModel.count(),
    ]);

    return {
      paginatedResult: questions,
      totalCount,
    };
  }
}
