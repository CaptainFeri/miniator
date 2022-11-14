import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { i18nValidationErrorFactory } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import appEnvConfig from './config/app-env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('miniator');
  const configService = app.get(ConfigService<ConfigType<typeof appEnvConfig>>);
  const swaggerInfo = configService.get('swagger', { infer: true });
  app.use(
    ['/api', '/api-json'],
    basicAuth({
      challenge: true,
      users: {
        [swaggerInfo.username]: swaggerInfo.password,
      },
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors();

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Miniator_auth API Document')
    .setDescription('API description')
    .setVersion('1.0.0')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: i18nValidationErrorFactory,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new HttpExceptionFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('port');
  await app.listen(port || 3000);

  logger.log(`Application listening on port: ${port}`);
}
bootstrap();
