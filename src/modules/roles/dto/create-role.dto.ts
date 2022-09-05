import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly isSpecial: boolean;

  @IsNotEmpty()
  @IsUUID()
  readonly companyId: boolean;
}
