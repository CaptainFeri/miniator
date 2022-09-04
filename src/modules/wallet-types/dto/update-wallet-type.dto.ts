import CreateWalletTypeDto from './create-wallet-type.dto';
import { IsUUID } from 'class-validator';

export default class UpdateWalletTypeDto extends CreateWalletTypeDto {
  @IsUUID()
  readonly id: string;
}
