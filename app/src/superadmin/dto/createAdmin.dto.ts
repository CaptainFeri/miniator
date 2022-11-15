import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiPropertyOptional()
  username: string;
  @ApiPropertyOptional()
  password: string;
}
