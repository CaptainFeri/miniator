import { ApiPropertyOptional } from '@nestjs/swagger';

export class AdminUpdateUesrDto {
  @ApiPropertyOptional()
  username: string;

  @ApiPropertyOptional()
  password: string;

  @ApiPropertyOptional()
  gender: string;

  @ApiPropertyOptional()
  birthday: string;

  @ApiPropertyOptional()
  city: string;

  @ApiPropertyOptional()
  phone: string;

  @ApiPropertyOptional()
  firstname: string;

  @ApiPropertyOptional()
  lastname: string;

  @ApiPropertyOptional()
  nationalCode: string;
}
