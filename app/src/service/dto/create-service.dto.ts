import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiPropertyOptional()
  title: string;
  @ApiPropertyOptional()
  minDeposit: string;
  @ApiPropertyOptional()
  maxDeposit: string;
  @ApiPropertyOptional()
  minWithdrawal: string;
  @ApiPropertyOptional()
  maxWithdrawal: string;
  @ApiPropertyOptional()
  maxCapacity: string;
}
