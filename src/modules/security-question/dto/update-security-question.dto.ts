import { PartialType } from '@nestjs/swagger';
import CreateSecurityQuestionDto from './create-security-question.dto';

export default class UpdateSecurityQuestionDto extends PartialType(
  CreateSecurityQuestionDto,
) {}
