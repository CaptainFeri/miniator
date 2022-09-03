import { IsNotEmpty, IsString } from 'class-validator';

export class SetSecurityQuestionDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string = '';

  @IsNotEmpty()
  @IsString()
  readonly answer: string = '';
}
