import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
  constructor(body: any) {
    if (body) {
      this.username = body.username;
      this.password = body.password;
    }
  }

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(128)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly companyId: string;

  @IsNotEmpty()
  @IsString()
  readonly roleId: string;
}
