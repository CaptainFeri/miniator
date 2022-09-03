import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateWalletDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly name: string = '';
}