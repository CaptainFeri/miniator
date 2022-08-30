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
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';

@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class WalletsGrpcController {
    constructor(private readonly walletsService: WalletsService) { }

    @Types(TypesEnum.superAdmin)
    @GrpcMethod('WalletService', 'Create')
    async Create(data: CreateWalletDto, metadata: Metadata, call: ServerUnaryCall<CreateWalletDto, any>) {
        const wallet = await this.walletsService.create(data);
        return ResponseUtils.success('wallets', {
            message: 'Success',
            wallet,
        });
    }

    @GrpcMethod('WalletService', 'GetAll')
    async getAll(query: any, metadata: Metadata, call: ServerUnaryCall<any, any>) {
        const paginationParams: PaginationParamsInterface | false =
            PaginationUtils.normalizeParams(query.page);
        if (!paginationParams) {
            throw new BadRequestException('Invalid pagination parameters');
        }
        const paginatedWallets = await this.walletsService.getAllWithPagination(
            paginationParams,
        );
        console.log(paginatedWallets.paginatedResult);
        const data = ResponseUtils.success('wallets', paginatedWallets.paginatedResult, {
            location: 'wallets',
            paginationParams,
            totalCount: paginatedWallets.totalCount,
        });
        return data;
    }

    @Types(TypesEnum.superAdmin)
    @GrpcMethod('WalletService', 'Update')
    async Update(body: UpdateWalletDto, metadata: Metadata, call: ServerUnaryCall<any, any>) {
        await this.walletsService.update(body);
        return ResponseUtils.success('wallets', {
            message: 'Success!',
        });
    }
}
