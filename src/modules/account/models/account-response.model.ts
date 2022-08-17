// eslint-disable-next-line max-classes-per-file
import { Exclude, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';
import { TypesEnum } from 'src/shared/decorators/types.decorator';

export class AccountResponseModel {
  id = 0;

  type: TypesEnum = TypesEnum.user;

  verified = false;

  email = '';

  @Exclude()
  password = '';
}

export class AllAccountsResponseModel {
  @ValidateNested({ each: true })
  @Type(() => AccountResponseModel)
  data?: [] = [];

  collectionName?: string = '';

  options?: {
    location: string;
    paginationParams: PaginationParamsInterface;
    totalCount: number;
  };
}
