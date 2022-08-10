import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCompanyDto {
  @ApiProperty({ type: String, maxLength: 64 })
  @IsNotEmpty()
  @IsString()
  readonly name: string = '';

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly minDeposit: number = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly maxDeposit: number = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly minWithdrawal: number = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly maxWithdrawal: number = 0;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  readonly maxCapacity: number = 0;
}
