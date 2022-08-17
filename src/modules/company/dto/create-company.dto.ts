import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCompanyDto {
  @ApiProperty({ type: String, maxLength: 64 })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly minDeposit: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly maxDeposit: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly minWithdrawal: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly maxWithdrawal: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly maxCapacity: number;
}
