import { TypesEnum } from '@decorators/types.decorator';

export interface ValidateAccountOutput {
  id: number;
  username?: string;
  type?: TypesEnum;
}
