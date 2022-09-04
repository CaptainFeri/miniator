import CreateSecurityQuestionDto from './create-security-question.dto';
import { IsUUID } from 'class-validator';

export default class UpdateSecurityQuestionDto extends CreateSecurityQuestionDto {
  @IsUUID()
  readonly id: string;
}
