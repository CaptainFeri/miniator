import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export default class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
