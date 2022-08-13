import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import WalletsService from './wallets.service';
import PaginationUtils from '../../../utils/pagination.utils';
import ResponseUtils from '../../../utils/response.utils';
import { Types, TypesEnum } from '@decorators/types.decorator';
import UpdateWalletDto from '@v1/wallets/dto/update-wallet.dto';
import CreateWalletDto from '@v1/wallets/dto/create-wallet.dto';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @Types(TypesEnum.superAdmin)
  async create(@Body() walletDto: CreateWalletDto): Promise<any> {
    const wallet = await this.walletsService.create(walletDto);

    return ResponseUtils.success('wallets', {
      message: 'Success',
      wallet,
    });
  }

  @Get()
  async getAll(@Query() query: any) {
    const paginationParams: PaginationParamsInterface | false =
      PaginationUtils.normalizeParams(query.page);
    if (!paginationParams) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    const paginatedWallets = await this.walletsService.getAllWithPagination(
      paginationParams,
    );

    return ResponseUtils.success('wallets', paginatedWallets.paginatedResult, {
      location: 'wallets',
      paginationParams,
      totalCount: paginatedWallets.totalCount,
    });
  }

  @Post(':id')
  @Types(TypesEnum.superAdmin)
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() wallet: UpdateWalletDto,
  ): Promise<any> {
    await this.walletsService.update(id, wallet);

    return ResponseUtils.success('wallets', {
      message: 'Success!',
    });
  }
}
