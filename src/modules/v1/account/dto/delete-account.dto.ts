import { IsNotEmpty, MinLength, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class DeleteAccountDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = '';
}
