import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

@Catch()
export class AllExceptionFilter extends HttpExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    return super.catch(
      exception instanceof HttpException
        ? exception
        : new InternalServerErrorException(),
      host,
    );
  }
}
