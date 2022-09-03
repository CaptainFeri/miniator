import { IsNotEmpty, IsString, IsJWT } from 'class-validator';

export default class VerifyAccountTokenDto {
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  readonly token: string = '';
}
