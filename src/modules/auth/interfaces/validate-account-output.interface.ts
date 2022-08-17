import { TypesEnum } from 'src/shared/decorators/types.decorator';

export interface ValidateAccountOutput {
  id: string;
  username?: string;
  type?: TypesEnum;
}
