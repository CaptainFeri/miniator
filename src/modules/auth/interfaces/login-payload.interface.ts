import { TypesEnum } from 'src/shared/decorators/types.decorator';

export interface LoginPayload {
  readonly id?: string;

  readonly username?: string;

  readonly type?: TypesEnum;
}
