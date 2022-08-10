export interface PaginatedEntityInterface<T> {
  readonly paginatedResult: T[],
  readonly totalCount: number,
}
