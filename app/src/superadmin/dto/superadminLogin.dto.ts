import { ApiPropertyOptional } from '@nestjs/swagger';

export class SuperAdminDto {
  @ApiPropertyOptional()
  username: string;
  @ApiPropertyOptional()
  password: string;
}
