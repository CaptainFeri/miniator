import { PartialType } from '@nestjs/swagger';
import CreateSecurityQuestionDto from '@v1/securityQuestion/dto/create-securityQuestion.dto';

export default class UpdateSecurityQuestionDto extends PartialType(CreateSecurityQuestionDto) {
}
