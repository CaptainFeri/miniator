import { CreateSecurityQuestionDto } from './create-security-question.dto';
import { IsUUID } from 'class-validator';

export class UpdateSecurityQuestionDto extends CreateSecurityQuestionDto {
  @IsUUID()
  readonly id: string;
}
