import {
    IsNotEmpty,
    MinLength,
    IsString,
    IsEmail,
    MaxLength,
    IsJWT,
  } from 'class-validator';
  
  export default class VerifyAccountTokenDto {

    @IsNotEmpty()
    @IsString()
    @IsJWT()
    readonly token: string = '';

  }
  