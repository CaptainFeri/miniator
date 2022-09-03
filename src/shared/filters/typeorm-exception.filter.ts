import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  NotFoundException,
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { AllExceptionFilter } from './all-exception.filter';

@Catch(TypeORMError)
export class TypeORMExceptionFilter extends AllExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    return super.catch(
      exception instanceof EntityNotFoundError
        ? new NotFoundException()
        : exception instanceof QueryFailedError
        ? new BadRequestException()
        : exception,
      host,
    );
  }
}
