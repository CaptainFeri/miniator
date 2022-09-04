import { BadRequestException, Controller } from '@nestjs/common';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import WalletTypesService from './wallet-types.service';
import PaginationUtils from '@utils/pagination.utils';
import { Types, TypesEnum } from '@decorators/types.decorator';
import CreateWalletTypeDto from './dto/create-wallet-type.dto';
import UpdateWalletTypeDto from './dto/update-wallet-type.dto';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export default class WalletTypesGrpcController {
  constructor(private readonly walletsService: WalletTypesService) {}

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('WalletTypeService', 'Create')
  async Create(data: CreateWalletTypeDto) {
    return await this.walletsService.create(data);
  }

  @GrpcMethod('WalletTypeService', 'GetAll')
  async getAll(query: any) {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);
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
  @GrpcMethod('WalletTypeService', 'Update')
  async Update(body: UpdateWalletTypeDto) {
    await this.walletsService.update(body);

    return {
      success: true,
    };
  }
}
