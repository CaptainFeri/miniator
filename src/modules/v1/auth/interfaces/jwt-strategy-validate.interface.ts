import { TypesEnum } from '@decorators/types.decorator';

export interface JwtStrategyValidate {
  id: number;
  username: string;
  type: TypesEnum;
}
