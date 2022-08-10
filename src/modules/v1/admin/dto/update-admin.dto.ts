import { PartialType } from '@nestjs/swagger';
import CreateAdminDto from '@v1/admin/dto/create-admin.dto';

export default class UpdateAdminDto extends PartialType(
  CreateAdminDto,
) {}
