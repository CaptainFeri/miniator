import { Redis } from 'ioredis';

import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

import authConstants from './constants/auth-constants';

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