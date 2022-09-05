import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSecurityQuestionDto {
  @IsNotEmpty()
  @IsString()
  readonly question: string;
}
