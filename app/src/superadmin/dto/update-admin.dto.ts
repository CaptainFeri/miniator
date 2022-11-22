import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdminDto {
  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  password?: string;
}
