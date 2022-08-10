import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateAdminDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  readonly username: string = '';
}
