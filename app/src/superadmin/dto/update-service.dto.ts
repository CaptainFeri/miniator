import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateServiceDto {
  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  public maxDeposit?: string;

  @ApiPropertyOptional()
  public minDeposit?: string;

  @ApiPropertyOptional()
  public minWithdrawal?: string;

  @ApiPropertyOptional()
  public maxWithdrawal?: string;

  @ApiPropertyOptional()
  public maxCapacity?: string;
}
