import { IsNotEmpty, MinLength, IsString, MaxLength } from 'class-validator';

export class DeleteAccountDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = '';
}
