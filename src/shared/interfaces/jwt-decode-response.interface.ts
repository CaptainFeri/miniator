import { TypesEnum } from '@decorators/types.decorator';

export interface JwtDecodeResponse {
  id: string;
  email: string;
  type: TypesEnum;
  iat: number;
  exp: number;
}
