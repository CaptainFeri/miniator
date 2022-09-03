// eslint-disable-next-line max-classes-per-file
import { Exclude, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { PaginationParamsInterface } from '@interfaces/pagination-params.interface';
import { TypesEnum } from '@decorators/types.decorator';

export class AdminResponseEntity {
  id = 0;

  type: TypesEnum = TypesEnum.admin;

  email = '';

  username = '';

  @Exclude()
  password = '';
}

export class AllAdminsResponseEntity {
  @ValidateNested({ each: true })
  @Type(() => AdminResponseEntity)
  data?: [] = [];

  collectionName?: string = '';

  options?: {
    location: string;
    paginationParams: PaginationParamsInterface;
    totalCount: number;
  };
}
