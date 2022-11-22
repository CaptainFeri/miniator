import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserFilterDto {
  @ApiPropertyOptional()
  take: number;
  @ApiPropertyOptional()
  skip: number;
}
