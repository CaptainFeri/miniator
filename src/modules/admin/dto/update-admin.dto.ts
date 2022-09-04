import { PartialType } from '@nestjs/mapped-types';
import CreateAdminDto from './create-admin.dto';

export default class UpdateAdminDto extends PartialType(CreateAdminDto) {}
