import { TypesEnum } from 'src/shared/decorators/types.decorator';

export interface JwtStrategyValidate {
  id: string;
  username: string;
  type: TypesEnum;
}
