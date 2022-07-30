import {
  IsNotEmpty,
  MinLength,
  IsString,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class SignUpDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(64)
  readonly username: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(5)
  @MaxLength(128)
  readonly email: string = '';

  // @ApiProperty({ type: String })
  // @IsNotEmpty()
  // @IsString()
  // @MinLength(11)
  // @MaxLength(11)
  // readonly phone_number: string = '';
}
