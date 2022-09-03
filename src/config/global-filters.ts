import { INestMicroservice } from '@nestjs/common';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { AllExceptionFilter } from '@filters/all-exception.filter';
import { TypeORMExceptionFilter } from '@filters/typeorm-exception.filter';

export function useGlobalFilters(app: INestMicroservice) {
  app.useGlobalFilters(
    new TypeORMExceptionFilter(),
    new HttpExceptionFilter(),
    new AllExceptionFilter(),
  );
}
