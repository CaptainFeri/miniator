import { ApiPropertyOptional } from '@nestjs/swagger';

export class SocialMediaDto {
  @ApiPropertyOptional()
  public type: number;

  @ApiPropertyOptional()
  public link: string;
}
