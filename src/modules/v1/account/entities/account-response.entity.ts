// eslint-disable-next-line max-classes-per-file
import { Exclude, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { TypesEnum } from '@decorators/types.decorator';

export class AccountResponseEntity {
  id = 0;

  type: TypesEnum = TypesEnum.user;

  verified = false;

  email = '';

  @Exclude()
  password = '';
}

export class AllAccountsResponseEntity {
  @ValidateNested({ each: true })
  @Type(() => AccountResponseEntity)
  data?: [] = [];

  collectionName?: string = '';

  options?: {
    location: string;
    paginationParams: PaginationParamsInterface;
    totalCount: number;
  };
}
