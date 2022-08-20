import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
import PaginationUtils from 'src/shared/utils/pagination.utils';
import UpdateSecurityQuestionDto from './dto/update-security-question.dto';
import SecurityQuestionEntity from './schemas/security-question.entity';
import SecurityQuestionAnswerEntity from 'src/modules/account/schemas/securityQuestionAnswer.entity';
import CreateSecurityQuestionDto from './dto/create-security-question.dto';

@Injectable()
export default class SecurityQuestionsRepository {
  constructor(
    @InjectRepository(SecurityQuestionEntity)
    private readonly securityQuestionsModel: Repository<SecurityQuestionEntity>,
    @InjectRepository(SecurityQuestionAnswerEntity)
    private readonly securityQuestionAnswersModel: Repository<SecurityQuestionAnswerEntity>,
  ) { }

  create(securityQuestion: CreateSecurityQuestionDto): Promise<SecurityQuestionEntity> {
    return this.securityQuestionsModel.save(securityQuestion);
  }

  async getById(id: string): Promise<SecurityQuestionEntity> {
    const item = await this.securityQuestionsModel.findOne(id);
    if(!item) {
      throw new NotFoundException('Security question not found');
    }
    return item;
  }

  updateById(id: string,data: UpdateSecurityQuestionDto): Promise<UpdateResult> {
    return this.securityQuestionsModel.update(id, data);
  }

  set(id: string,userId: string,answer: string): Promise<SecurityQuestionAnswerEntity> {
    return this.securityQuestionAnswersModel.save({
      accountEntity: {
        id: userId,
      },
      securityQuestionEntity: {
        id,
      },
      answer,
    });
  }

  public async getAllWithPagination(options: PaginationParamsInterface): Promise<PaginatedEntityInterface<SecurityQuestionEntity>> {
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
