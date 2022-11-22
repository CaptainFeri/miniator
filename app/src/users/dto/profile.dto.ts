import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileDto {
  @ApiPropertyOptional()
  public gender?: number;
  @ApiPropertyOptional()
  public birthday?: string;
  @ApiPropertyOptional()
  public city?: string;
  @ApiPropertyOptional()
  public phone?: string;
  @ApiPropertyOptional()
  public firstname?: string;
  @ApiPropertyOptional()
  public lastname?: string;
  @ApiPropertyOptional()
  public nationalCode?: string;
}
