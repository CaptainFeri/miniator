import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SetSecurityQuestionDto {
  @IsUUID()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly answer: string;
}
