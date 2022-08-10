import { TypesEnum } from '@decorators/types.decorator';

export interface JwtDecodeResponse {
  id: number;
  email: string;
  type: TypesEnum;
  iat: number;
  exp: number;
}
