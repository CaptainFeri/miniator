import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly minDeposit: number;

  @IsNotEmpty()
  @IsNumber()
  readonly maxDeposit: number;

  @IsNotEmpty()
  @IsNumber()
  readonly minWithdrawal: number;

  @IsNotEmpty()
  @IsNumber()
  readonly maxWithdrawal: number;

  @IsNotEmpty()
  @IsNumber()
  readonly maxCapacity: number;
}
