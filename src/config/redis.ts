import { ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

export const redis = RedisModule.forRootAsync({
  useFactory: (cfg: ConfigService) => ({
    config: {
      host: cfg.get('REDIS_HOST'),
      port: 6379,
    },
  }),
  inject: [ConfigService],
});
