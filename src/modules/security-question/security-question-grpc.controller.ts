import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import JwtAccessGuard from 'src/shared/guards/jwt-access.guard';
  import WrapResponseInterceptor from 'src/shared/interceptors/wrap-response.interceptor';
  import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
  import { PaginatedEntityInterface } from 'src/shared/interfaces/paginatedEntity.interface';
  import SecurityQuestionsService from './security-question.service';
  import ResponseUtils from 'src/shared/utils/response.utils';
  import PaginationUtils from 'src/shared/utils/pagination.utils';
  import AccountEntity from '@entities/account.entity';
  import User from 'src/shared/decorators/user.decorator';
  import { Types, TypesEnum } from 'src/shared/decorators/types.decorator';
  import { Public } from 'src/shared/decorators/public.decorator';
  import CreateSecurityQuestionDto from './dto/create-security-question.dto';
  import SecurityQuestionEntity from '@entities/security-question.entity';
  import UpdateSecurityQuestionDto from './dto/update-security-question.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { SetSecurityQuestionDto } from './dto/set-security-question.dto';
  
  @UseInterceptors(WrapResponseInterceptor)
  @Controller()
  export default class SecurityQuestionsGrpcController {
    constructor(
      private readonly securityQuestionsService: SecurityQuestionsService,
    ) { }
  
    @Types(TypesEnum.superAdmin)
    @GrpcMethod('QuestionService', 'Create')
    async Create(data: CreateSecurityQuestionDto, metadata: Metadata, call: ServerUnaryCall<any, any>) {
      const securityquestion = await this.securityQuestionsService.create(
        data,
      );

      console.log(securityquestion);
      return ResponseUtils.success('securityQuestions', {
        message: 'Success',
        securityquestion,
      });
    }
  
    @Public()
    @GrpcMethod('QuestionService', 'GetAll')
    async getAll(query: any, metadata: Metadata, call: ServerUnaryCall<any, any>) {
      const paginationParams: PaginationParamsInterface | false =
        PaginationUtils.normalizeParams(query.page);
      if (!paginationParams) {
        throw new BadRequestException('Invalid pagination parameters');
      }
  
      const paginatedQuestions: PaginatedEntityInterface<SecurityQuestionEntity> =
        await this.securityQuestionsService.getAllWithPagination(
          paginationParams,
        );
  
      return ResponseUtils.success(
        'securityQuestions',
        paginatedQuestions.paginatedResult,
        {
          location: 'securityQuestions',
          paginationParams,
          totalCount: paginatedQuestions.totalCount,
        },
      );
    }
  
    @Types(TypesEnum.superAdmin)
    @GrpcMethod('QuestionService', 'Update')
    async update(body: UpdateSecurityQuestionDto, metadata: Metadata, call: ServerUnaryCall<any, any>) {
      await this.securityQuestionsService.update(body.id, body);
      return ResponseUtils.success('securityQuestions', {
        message: 'Success!',
      });
    }
  

    //TODO later
    @GrpcMethod('QuestionService', 'Set')
    @UseGuards(JwtAccessGuard)
    async set(body: SetSecurityQuestionDto, metadata: Metadata, call: ServerUnaryCall<any, any>, @User() account: AccountEntity) {
      await this.securityQuestionsService.set(body.id, account.id, body.answer);
      return ResponseUtils.success('securityQuestions', {
        message: 'Success!',
      });
    }
  }
  