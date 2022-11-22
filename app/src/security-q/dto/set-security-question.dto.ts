import { ApiPropertyOptional } from '@nestjs/swagger';

export class setSecurityQuestionDto {
  @ApiPropertyOptional()
  questionId: number;
  @ApiPropertyOptional()
  answer: string;
}
