import { PartialType } from '@nestjs/mapped-types';
import CreateRoleDto from './create-role.dto';
import { IsUUID } from 'class-validator';

export default class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsUUID()
  readonly id: string;
}
