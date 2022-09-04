import { PartialType } from '@nestjs/mapped-types';
import CreateCompanyDto from './create-company.dto';

export default class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
