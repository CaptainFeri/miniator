import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nValidationException } from 'nestjs-i18n';
import { TranslateHandler } from '../handler/translate.handler';
import { IResponse } from '../interface/response.interface';

@Catch(HttpException)
export class HttpExceptionFilter<T>
  extends TranslateHandler
  implements ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    this.setI18nContextFromArgumentHost(host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const result: IResponse = {
      status: exception.getStatus(),
      data: null,
      errors: {},
    };
    let httpStatus = HttpStatus.BAD_REQUEST;

    if (exception instanceof I18nValidationException) {
      result.errors = this.makeErrorObject(exception.errors);
      result.message = this.getMessage('BAD_REQUEST');
    } else if (exception instanceof InternalServerErrorException) {
      result.message = exception.message;
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (exception instanceof HttpException) {
      const message = exception.getResponse()['message'];
      if (message.includes('Cannot')) {
        httpStatus = HttpStatus.NOT_FOUND;
        result.message = message;
        result.errors = {};
      } else {
        if (typeof message === 'string') {
          result.message = this.getMessage(message);
        } else {
          result.message = this.getMessage(exception.getResponse()['error']);
          result.errors = message;
        }
      }
    }

    response.status(httpStatus).json(result);
  }
}
