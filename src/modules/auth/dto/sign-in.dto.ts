import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export default class SignInDto {
  constructor(body: SignInDto | null = null) {
    if (body) {
      this.username = body.username;
      this.password = body.password;
    }
  }

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(128)
  readonly username: string = '';

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = '';
}
