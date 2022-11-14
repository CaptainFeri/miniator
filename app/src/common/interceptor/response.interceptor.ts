import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';
import { IResponse } from '../interface/response.interface';
import { TranslateHandler } from '../handler/translate.handler';

@Injectable()
export class ResponseInterceptor
  extends TranslateHandler
  implements NestInterceptor
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse> {
    this.setI18nContextFromRequest(
      context.switchToHttp().getRequest<Request>(),
    );
    return next.handle().pipe(
      map(({ data, message, status }: IResponse) => ({
        status: status ?? 200,
        message: this.getMessage(message),
        data: data ?? null,
      })),
    );
  }
}
