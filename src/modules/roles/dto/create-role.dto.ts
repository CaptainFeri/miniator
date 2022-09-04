import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string = '';
}
