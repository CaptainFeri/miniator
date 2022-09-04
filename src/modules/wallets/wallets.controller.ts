import {
  BadRequestException,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import WalletsService from './wallets.service';
import ResponseUtils from '@utils/response.utils';
import PaginationUtils from '@utils/pagination.utils';
import { GrpcMethod } from '@nestjs/microservices';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class WalletsGrpcController {
  constructor(private readonly walletsService: WalletsService) {}

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
}
