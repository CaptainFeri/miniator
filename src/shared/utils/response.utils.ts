import { PaginationParamsInterface } from 'src/shared/interfaces/pagination-params.interface';

export default new class ResponseUtils {
  public success(
    collectionName: string,
    data: any,
    options?: {
      location: string;
      paginationParams: PaginationParamsInterface;
      totalCount: number;
    },
  ) {
    return {
      collectionName,
      data,
      options,
    };
  }
}
