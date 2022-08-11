export interface DecodedAccount {
  readonly id: string;

  readonly username: string;

  readonly password: string;

  readonly email: string;

  readonly type: string;

  readonly iat?: number;

  readonly exp?: number;
}
