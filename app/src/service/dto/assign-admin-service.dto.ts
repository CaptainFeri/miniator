import { ApiPropertyOptional } from '@nestjs/swagger';

export class AssignAdminServiceDto {
  @ApiPropertyOptional()
  public adminId: number;
  @ApiPropertyOptional()
  public serviceId: number;
}
