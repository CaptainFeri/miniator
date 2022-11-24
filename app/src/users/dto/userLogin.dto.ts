import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserLoginDto {
  @ApiPropertyOptional()
  username: string;
  @ApiPropertyOptional()
  password: string;
  @ApiPropertyOptional()
  serviceId: number;
  @ApiPropertyOptional()
  roleId: number;
}
