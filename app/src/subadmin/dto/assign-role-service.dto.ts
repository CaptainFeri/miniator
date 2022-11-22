import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignRoleServiceDto {
  @ApiPropertyOptional()
  serviceId: number;

  @ApiPropertyOptional()
  roleId: number;
}
