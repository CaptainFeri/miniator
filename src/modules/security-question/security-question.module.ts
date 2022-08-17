import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import SecurityQuestionController from './security-question.controller';
import SecurityQuestionsService from './security-question.service';
import SecurityQuestionEntity from './schemas/security-question.entity';
import SecurityQuestionAnswerEntity from 'src/modules/account/schemas/securityQuestionAnswer.entity';
import SecurityQuestionsRepository from './security-question.repository';

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
