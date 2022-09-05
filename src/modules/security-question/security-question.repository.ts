import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import PaginationUtils from '@utils/pagination.utils';
import { UpdateSecurityQuestionDto } from './dto/update-security-question.dto';
import { SecurityQuestionEntity } from '@entities/security-question.entity';
import { SecurityQuestionAnswerEntity } from '@entities/securityQuestionAnswer.entity';
import { CreateSecurityQuestionDto } from './dto/create-security-question.dto';

@Injectable()
export class SecurityQuestionsRepository {
  constructor(
    @InjectRepository(SecurityQuestionEntity)
    private readonly securityQuestionsModel: Repository<SecurityQuestionEntity>,
    @InjectRepository(SecurityQuestionAnswerEntity)
    private readonly securityQuestionAnswersModel: Repository<SecurityQuestionAnswerEntity>,
  ) {}

  create(
    securityQuestion: CreateSecurityQuestionDto,
  ): Promise<SecurityQuestionEntity> {
    return this.securityQuestionsModel.save(securityQuestion);
  }

  async getById(id: string): Promise<SecurityQuestionEntity> {
    const item = await this.securityQuestionsModel.findOne(id);
    if (!item) {
      throw new NotFoundException('Security question not found');
    }
    return item;
  }

  updateById(
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
      account: {
        id: userId,
      },
      securityQuestion: {
        id,
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
