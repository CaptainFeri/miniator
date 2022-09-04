import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import SecurityQuestionsService from './security-question.service';
import SecurityQuestionEntity from '@entities/security-question.entity';
import SecurityQuestionAnswerEntity from '@entities/securityQuestionAnswer.entity';
import SecurityQuestionsRepository from './security-question.repository';
import SecurityQuestionsController from './security-question.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SecurityQuestionEntity,
      SecurityQuestionAnswerEntity,
    ]),
  ],
  controllers: [SecurityQuestionsController],
  providers: [SecurityQuestionsService, SecurityQuestionsRepository],
  exports: [SecurityQuestionsService, SecurityQuestionsRepository],
})
export default class SecurityQuestionsModule {}
