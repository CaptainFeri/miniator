import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AdminSignInDto {
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
}
