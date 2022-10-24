import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { WalletTypesService } from './wallet-types.service';
import PaginationUtils from '@utils/pagination.utils';
import { Types, TypesEnum } from '@decorators/types.decorator';
import { CreateWalletTypeDto } from './dto/create-wallet-type.dto';
import { UpdateWalletTypeDto } from './dto/update-wallet-type.dto';

@Controller()
export class WalletTypesController {
  constructor(private readonly walletsService: WalletTypesService) {}

  @Types(TypesEnum.superAdmin)
  @MessagePattern('WalletTypeService_Create')
  async Create(@Payload() msg: any) {
    const data: CreateWalletTypeDto = msg.value;
    return await this.walletsService.create(data);
  }

  @MessagePattern('WalletTypeService_GetAll')
  async getAll(@Payload() msg: any) {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(msg.value.page);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }
    const paginatedWallets = await this.walletsService.getAllWithPagination(
      paginationParams,
    );

    return {
      walletTypes: paginatedWallets.paginatedResult,
      totalCount: paginatedWallets.totalCount,
    };
  }

  @Types(TypesEnum.superAdmin)
  @MessagePattern('WalletTypeService_Update')
  async Update(@Payload() msg: any) {
    const body: UpdateWalletTypeDto = msg.value;
    await this.walletsService.update(body);

    return {
      success: true,
    };
  }
}
