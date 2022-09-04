import { PartialType } from '@nestjs/mapped-types';
import CreateRoleDto from './create-role.dto';

export default class UpdateRoleDto extends PartialType(CreateRoleDto) {}
