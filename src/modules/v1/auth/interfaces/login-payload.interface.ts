import { TypesEnum } from '@decorators/types.decorator';

export interface LoginPayload {
  readonly id?: number;

  readonly username?: string;

  readonly type?: TypesEnum;
}
