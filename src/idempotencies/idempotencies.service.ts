import { Injectable } from '@nestjs/common';

import { CACHE_KEYS, TTL } from '@src/cache/cache.const';
import { CacheService } from '@src/cache/cache.service';

import { IdempotencyStatusEnum } from './idempotency-status.enum';

interface CachedResponse {
  idempotencyKey: string;
  status: IdempotencyStatusEnum;
  response?: any;
  error?: any;
}

@Injectable()
export class IdempotenciesService {
  constructor(private readonly cacheService: CacheService) {}

  async getResponse(key: string): Promise<CachedResponse | undefined> {
    const result = await this.cacheService.get(CACHE_KEYS.IDEMPOTENT_KEY(key));
    return result as CachedResponse | undefined;
  }

  async markInProgress(key: string): Promise<void> {
    const cachedResponse: CachedResponse = {
      idempotencyKey: key,
      status: IdempotencyStatusEnum.inProgress,
    };
    await this.cacheService.set(
      CACHE_KEYS.IDEMPOTENT_KEY(key),
      cachedResponse,
      TTL.IDEMPOTENT,
    );
  }

  async storeResponse(
    key: string,
    status: IdempotencyStatusEnum,
    responseOrError: any,
  ): Promise<void> {
    const cachedResponse: CachedResponse = {
      idempotencyKey: key,
      status,
    };
    if (status === IdempotencyStatusEnum.completed) {
      cachedResponse.response = responseOrError;
    } else {
      cachedResponse.error = responseOrError;
    }
    await this.cacheService.set(
      CACHE_KEYS.IDEMPOTENT_KEY(key),
      cachedResponse,
      TTL.IDEMPOTENT,
    );
  }
}
