import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { PaginatedEntityInterface } from '@interfaces/paginatedEntity.interface';
import SecurityQuestionsRepository from './security-question.repository';
import SecurityQuestionEntity from '@entities//security-question.entity';
import UpdateSecurityQuestionDto from './dto/update-security-question.dto';
import CreateSecurityQuestionDto from './dto/create-security-question.dto';

@Injectable()
export default class SecurityQuestionsService {
  constructor(
    private readonly securityQuestionsRepository: SecurityQuestionsRepository,
  ) { }

  create(securityQuestion: CreateSecurityQuestionDto): Promise<SecurityQuestionEntity> {
    return this.securityQuestionsRepository.create(securityQuestion);
  }

  getById(id: string): Promise<SecurityQuestionEntity> {
    return this.securityQuestionsRepository.getById(id);
  }

  update(id: string, data: UpdateSecurityQuestionDto): Promise<UpdateResult> {
    return this.securityQuestionsRepository.updateById(id, data);
  }

  set(id: string, userId: string, answer: string) {
    return this.securityQuestionsRepository.set(id, userId, answer);
  }

  getAllWithPagination(options: PaginationParamsInterface): Promise<PaginatedEntityInterface<SecurityQuestionEntity>> {
    return this.securityQuestionsRepository.getAllWithPagination(options);
  }
}
