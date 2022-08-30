import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import SecurityQuestionController from './security-question.controller';
import SecurityQuestionsService from './security-question.service';
import SecurityQuestionEntity from '@entities/security-question.entity';
import SecurityQuestionAnswerEntity from '@entities/securityQuestionAnswer.entity';
import SecurityQuestionsRepository from './security-question.repository';
import SecurityQuestionsGrpcController from './security-question-grpc.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SecurityQuestionEntity,
      SecurityQuestionAnswerEntity,
    ]),
  ],
  controllers: [SecurityQuestionsGrpcController],
  providers: [SecurityQuestionsService, SecurityQuestionsRepository],
  exports: [SecurityQuestionsService, SecurityQuestionsRepository],
})
export default class SecurityQuestionsModule {}
