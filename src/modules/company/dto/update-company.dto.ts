import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export default class UpdateCompanyDto {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsNumber()
  readonly minDeposit: number;

  @IsOptional()
  @IsNumber()
  readonly maxDeposit: number;

  @IsOptional()
  @IsNumber()
  readonly minWithdrawal: number;

  @IsOptional()
  @IsNumber()
  readonly maxWithdrawal: number;

  @IsOptional()
  @IsNumber()
  readonly maxCapacity: number;
}
