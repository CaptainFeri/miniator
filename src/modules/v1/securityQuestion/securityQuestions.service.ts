import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import CreateSecurityQuestionDto from '@v1/securityQuestion/dto/create-securityQuestion.dto';
import SecurityQuestionsRepository from './securityQuestions.repository';
import SecurityQuestionEntity from './schemas/securityQuestion.entity';
import UpdateSecurityQuestionDto from './dto/update-securityQuestion.dto';

@Injectable()
export default class SecurityQuestionsService {
  constructor(
    private readonly securityQuestionsRepository: SecurityQuestionsRepository,
  ) {}

  public async create(
    securityQuestion: CreateSecurityQuestionDto,
  ): Promise<SecurityQuestionEntity> {
    return this.securityQuestionsRepository.create({
      ...securityQuestion,
    });
  }

  public async getById(
    id: string,
  ): Promise<SecurityQuestionEntity | undefined> {
    return this.securityQuestionsRepository.getById(id);
  }

  update(id: string, data: UpdateSecurityQuestionDto): Promise<UpdateResult> {
    return this.securityQuestionsRepository.updateById(id, data);
  }

  set(id: string, userId: string, answer: string) {
    return this.securityQuestionsRepository.set(id, userId, answer);
  }

  public async getAllWithPagination(
    options: PaginationParamsInterface,
  ): Promise<PaginatedEntityInterface<SecurityQuestionEntity>> {
    return this.securityQuestionsRepository.getAllWithPagination(options);
  }
}
