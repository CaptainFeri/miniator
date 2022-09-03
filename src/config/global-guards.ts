import { INestMicroservice } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { BasicAuthGuard } from '@guards/basic-auth.guard';
import JwtAccessGuard from '@guards/jwt-access.guard';

export function useGlobalGuards(app: INestMicroservice) {
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new BasicAuthGuard(configService),
    new JwtAccessGuard(reflector, configService),
  );
}
