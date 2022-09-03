import { TypesEnum } from '@decorators/types.decorator';

export interface LoginPayload {
  readonly id?: string;

  readonly username?: string;

  readonly type?: TypesEnum;
}
