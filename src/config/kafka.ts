import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

/* eslint-disable */
// @ts-ignore
export const kafka = ClientsModule.registerAsync([
  {
    name: 'AUTH_SERVICE',
    useFactory: (config: ConfigService) => ({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'auth',
          brokers: [
            `${config.get('KAFKA_BROKER_HOST')}:${config.get(
              'KAFKA_BROKER_PORT',
            )}`,
          ],
        },
        producer: {
          allowAutoTopicCreation: true,
        },
        consumer: {
          groupId: 'auth-consumer',
        },
      },
    }),
    inject: [ConfigService],
  },
]);