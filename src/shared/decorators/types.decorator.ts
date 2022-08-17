import { SetMetadata } from '@nestjs/common';

export enum TypesEnum {
  superAdmin = 'super-admin',
  admin = 'admin',
  user = 'user',
}

export const Types = (...types: TypesEnum[]) => SetMetadata('types', types);
