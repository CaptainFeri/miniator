import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
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

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class WalletTypesController {
  constructor(private readonly walletsService: WalletTypesService) {}

  @Post()
  @Types(TypesEnum.superAdmin)
  async create(@Body() walletDto: CreateWalletTypeDto): Promise<any> {
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
    console.log(paginationParams);
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
    @Param('id', ParseUUIDPipe) _id: string,
    @Body() _wallet: UpdateWalletTypeDto,
  ): Promise<any> {
    return '';
  }
}
