import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateSecurityQuestionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly question: string;
}
