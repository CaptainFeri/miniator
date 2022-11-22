import { ApiPropertyOptional } from '@nestjs/swagger';

export class ForgetPasswordDto {
  @ApiPropertyOptional()
  username: string;

  @ApiPropertyOptional()
  answer: string;
}
