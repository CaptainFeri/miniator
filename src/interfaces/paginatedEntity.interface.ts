import AccountEntity from '@v1/account/schemas/account.entity';

export interface PaginatedAccountsInterface {
  readonly paginatedResult: AccountEntity[] | [],
  readonly totalCount: number,
}
