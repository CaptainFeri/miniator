import { CreateWalletTypeDto } from './create-wallet-type.dto';
import { IsUUID } from 'class-validator';

export class UpdateWalletTypeDto extends CreateWalletTypeDto {
  @IsUUID()
  readonly id: string;
}
