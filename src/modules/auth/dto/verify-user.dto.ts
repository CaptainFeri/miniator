import { ApiProperty } from '@nestjs/swagger';

export default class VerifyAccountDto {
  @ApiProperty({ type: String })
  readonly email: string = '';
}
