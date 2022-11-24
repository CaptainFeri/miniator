import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiPropertyOptional()
  username: string;
  @ApiPropertyOptional()
  password: string;
  @ApiPropertyOptional()
  serviceId: number;
}

export class RegisterUserDto {
  @ApiPropertyOptional()
  username: string;
  @ApiPropertyOptional()
  password: string;

  @ApiPropertyOptional()
  questionId: number;
  @ApiPropertyOptional()
  answer: string;
  @ApiPropertyOptional()
  serviceId: number;
  @ApiPropertyOptional()
  roleId: number;
}
