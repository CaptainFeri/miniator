import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  vip: boolean;
}
