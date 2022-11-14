import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('super-admin')
export class AdminController {}
