import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateSecurityQuestionDto {
  @IsNotEmpty()
  @IsString()
  readonly question: string;
}
