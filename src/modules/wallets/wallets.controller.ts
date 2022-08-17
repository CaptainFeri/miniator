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
import WrapResponseInterceptor from 'src/shared/interceptors/wrap-response.interceptor';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import WalletsService from './wallets.service';
import ResponseUtils from 'src/shared/utils/response.utils';
import PaginationUtils from 'src/shared/utils/pagination.utils';
import { Types, TypesEnum } from 'src/shared/decorators/types.decorator';
import CreateWalletDto from './dto/create-wallet.dto';
import UpdateWalletDto from './dto/update-wallet.dto';

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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() wallet: UpdateWalletDto,
  ): Promise<any> {
    await this.walletsService.update(id, wallet);

    return ResponseUtils.success('wallets', {
      message: 'Success!',
    });
  }
}
