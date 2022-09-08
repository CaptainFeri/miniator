import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WALLET_PACKAGE_NAME } from '@interfaces/wallet.interface';

export const wallet = ClientsModule.registerAsync([
  {
    name: 'WALLET_SERVICE',
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        url: config.get('WALLET_SERVICE_URL'),
        package: WALLET_PACKAGE_NAME,
        protoPath: 'proto/wallet/wallet.proto',
      },
    }),
    inject: [ConfigService],
  },
]);
