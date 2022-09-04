import { Redis } from 'ioredis';

import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

import authConstants from './constants/auth-constants';
import AccountEntity from '@entities/account.entity';

@Injectable()
export default class AuthRepository {
  private readonly redisClient: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = redisService.getClient();
  }

  public async addRefreshToken(username: string, token: string): Promise<void> {
    await this.redisClient.set(
      username,
      token,
      'EX',
      authConstants.redis.expirationTime.jwt.refreshToken,
    );
  }

  public async addUser(account: AccountEntity): Promise<void> {
    await this.redisClient.set(
      `password:${account.username}`,
      account.password,
    );
    await this.redisClient.set(`password:${account.email}`, account.password);
    await this.redisClient.set(`id:${account.username}`, account.id);
    await this.redisClient.set(`id:${account.email}`, account.id);
  }

  public async addUserRole(
    accountId: string,
    roleId: string,
    walletType: string,
    walletId: string,
  ): Promise<void> {
    await this.redisClient.set(
      `wallet:${accountId}:${roleId}:${walletType}`,
      walletId,
    );
  }

  public getToken(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  public removeToken(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  public removeAllTokens(): Promise<string> {
    return this.redisClient.flushall();
  }
}
