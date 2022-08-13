import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import SecurityQuestionController from './securityQuestions.controller';
import SecurityQuestionsService from './securityQuestions.service';
import SecurityQuestionEntity from './schemas/securityQuestion.entity';
import SecurityQuestionAnswerEntity from '@v1/account/schemas/securityQuestionAnswer.entity';
import SecurityQuestionsRepository from './securityQuestions.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SecurityQuestionEntity,
      SecurityQuestionAnswerEntity,
    ]),
  ],
  controllers: [SecurityQuestionController],
  providers: [SecurityQuestionsService, SecurityQuestionsRepository],
  exports: [SecurityQuestionsService, SecurityQuestionsRepository],
})
export default class SecurityQuestionsModule {}
