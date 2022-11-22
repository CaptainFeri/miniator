import { ApiPropertyOptional } from '@nestjs/swagger';

export class createSecurityQuestionDto {
  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  serviceId: number;
}
