import { INestMicroservice, ValidationPipe } from '@nestjs/common';

export function useGlobalPipes(app: INestMicroservice) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
}
