import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;
}
