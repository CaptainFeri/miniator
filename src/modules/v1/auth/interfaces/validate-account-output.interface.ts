import { TypesEnum } from '@decorators/types.decorator';

export interface ValidateAccountOutput {
  id: string;
  username?: string;
  type?: TypesEnum;
}
