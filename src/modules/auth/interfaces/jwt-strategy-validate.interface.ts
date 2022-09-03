import { TypesEnum } from '@decorators/types.decorator';

export interface JwtStrategyValidate {
  id: string;
  username: string;
  type: TypesEnum;
}
