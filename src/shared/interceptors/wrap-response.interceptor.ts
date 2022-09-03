import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Serializer } from 'jsonapi-serializer';
import * as _ from 'lodash';
import PaginationUtils from '@utils/pagination.utils';

@Injectable()
export default class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((...args) => {
        const serializeOptions: any = {};
        const { data, options, collectionName } = args[0];

        if (data && collectionName) {
          if (data.length) {
            console.log("1");
            serializeOptions.attributes = Object.keys(
              _.omit(data[0]),
            );
          } else {
            console.log("2");
            console.log(data);
            serializeOptions.attributes = Object.keys(
              _.omit(data),
            );
          }
          if (options) {
            serializeOptions.topLevelLinks = PaginationUtils.getPaginationLinks(
              options.location,
              options.paginationParams,
              options.totalCount,
            );
            serializeOptions.meta = { totalCount: options.totalCount };
          }

          const d =  new Serializer(collectionName, serializeOptions).serialize(
            data,
          );
          // console.log(d.data[0]['attributes']);
          console.log(d);
          return d;
        }

        const d =  {
          data: args[0].data ?? args[0],
        };
        console.log(d);
        return d;
      }),
    );
  }
}
