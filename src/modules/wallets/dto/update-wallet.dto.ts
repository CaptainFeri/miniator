import { PartialType } from '@nestjs/swagger';
import CreateWalletDto from './create-wallet.dto';

export default class UpdateWalletDto extends PartialType(CreateWalletDto) {}
