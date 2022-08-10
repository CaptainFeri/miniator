import { PartialType } from '@nestjs/swagger';
import CreateCompanyDto from '@v1/company/dto/create-company.dto';

export default class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
}
