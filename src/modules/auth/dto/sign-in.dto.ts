import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export default class SignInDto {

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
