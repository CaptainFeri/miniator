import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

export const mailer = MailerModule.forRootAsync({
  useFactory: (cfg: ConfigService) => ({
    transport: {
      host: cfg.get('MAILER_HOST'),
      port: Number(cfg.get('MAILER_PORT')),
      secure: false,
      auth: {
        user: cfg.get('MAILER_USERNAME'),
        pass: cfg.get('MAILER_PASSWORD'),
      },
    },
    defaults: {
      from: cfg.get('MAILER_FROM_EMAIL'),
    },
    template: {
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ConfigService],
});
