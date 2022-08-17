import { TypesEnum } from 'src/shared/decorators/types.decorator';

export interface JwtDecodeResponse {
  id: string;
  email: string;
  type: TypesEnum;
  iat: number;
  exp: number;
}
