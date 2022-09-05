import {
  IsNotEmpty,
  MinLength,
  IsString,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(64)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(5)
  @MaxLength(128)
  readonly email: string;

  // @ApiProperty({ type: String })
  // @IsNotEmpty()
  // @IsString()
  // @MinLength(11)
  // @MaxLength(11)
  // readonly phone_number: string = '';
}
