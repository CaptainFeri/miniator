import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiPropertyOptional()
  title: string;
  @ApiPropertyOptional()
  adminId: number;
}
