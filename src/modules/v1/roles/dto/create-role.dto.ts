import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateRoleDto {
  @ApiProperty({ type: String, maxLength: 64 })
  @IsNotEmpty()
  @IsString()
  readonly name: string = '';
}
