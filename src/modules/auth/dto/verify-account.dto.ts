import { IsNotEmpty, IsString, IsJWT } from 'class-validator';

export class VerifyAccountTokenDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  readonly token: string;
}
