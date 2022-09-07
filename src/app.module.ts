import { Module } from '@nestjs/common';
import { config } from './config/config';
import { database } from './config/database';
import { redis } from './config/redis';
import { mailer } from './config/mailer';
import { AuthModule } from '@/auth/auth.module';
import { AdminsModule } from '@/admin/admins.module';
import { AccountsModule } from '@/account/accounts.module';
import { RolesModule } from '@/roles/roles.module';
import { CompaniesModule } from '@/company/companies.module';
import { SecurityQuestionsModule } from '@/security-question/security-question.module';
import { WalletTypesModule } from '@/wallet-types/wallet-types.module';
import { WalletsModule } from '@/wallets/wallets.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WALLET_PACKAGE_NAME } from '@interfaces/wallet.interface';

@Module({
  imports: [
    config,
    database,
    redis,
    mailer,
    ClientsModule.registerAsync([
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
      },
    ]),
    AuthModule,
    AdminsModule,
    AccountsModule,
    RolesModule,
    CompaniesModule,
    SecurityQuestionsModule,
    WalletTypesModule,
    WalletsModule,
  ],
})
export class AppModule {}
