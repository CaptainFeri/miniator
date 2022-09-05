import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletTypeDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
