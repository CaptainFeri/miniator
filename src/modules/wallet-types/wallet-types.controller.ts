import {
  BadRequestException,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import WalletTypesService from './wallet-types.service';
import ResponseUtils from '@utils/response.utils';
import PaginationUtils from '@utils/pagination.utils';
import { Types, TypesEnum } from '@decorators/types.decorator';
import CreateWalletTypeDto from './dto/create-wallet-type.dto';
import UpdateWalletTypeDto from './dto/update-wallet-type.dto';
import { GrpcMethod } from '@nestjs/microservices';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class WalletTypesGrpcController {
  constructor(private readonly walletsService: WalletTypesService) {}

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('WalletService', 'Create')
  async Create(data: CreateWalletTypeDto) {
    const wallet = await this.walletsService.create(data);
    return ResponseUtils.success('wallets', {
      message: 'Success',
      wallet,
    });
  }

  @GrpcMethod('WalletService', 'GetAll')
  async getAll(query: any) {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }
    const paginatedWallets = await this.walletsService.getAllWithPagination(
      paginationParams,
    );
    console.log(paginatedWallets.paginatedResult);
    return ResponseUtils.success('wallets', paginatedWallets.paginatedResult, {
      location: 'wallets',
      paginationParams,
      totalCount: paginatedWallets.totalCount,
    });
  }

  @Types(TypesEnum.superAdmin)
  @GrpcMethod('WalletService', 'Update')
  async Update(body: UpdateWalletTypeDto) {
    await this.walletsService.update(body);
    return ResponseUtils.success('wallets', {
      message: 'Success!',
    });
  }
}
