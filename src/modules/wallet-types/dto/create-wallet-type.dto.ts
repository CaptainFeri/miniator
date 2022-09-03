import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateWalletTypeDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string = '';
}
