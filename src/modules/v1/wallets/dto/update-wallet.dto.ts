import { PartialType } from '@nestjs/swagger';
import CreateWalletDto from '@v1/wallets/dto/create-wallet.dto';

export default class UpdateWalletDto extends PartialType(CreateWalletDto) {}
