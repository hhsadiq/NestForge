import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

import { AllConfigType } from '@src/config/config.type';

@Injectable()
export class CacheService {
  private defaultTTL: number;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private configService: ConfigService<AllConfigType>,
  ) {
    this.defaultTTL = this.configService.getOrThrow('redis.defaultTTL', {
      infer: true,
    });
  }

  /**
   * Get value from cache
   * @param key Cache key
   * @returns Parsed value or null if not found
   */
  public async get<T = unknown>(key: string): Promise<T | null> {
    const data = await this.cacheManager.get<T>(key);
    return data === undefined ? null : data;
  }

  /**
   * Store value in cache
   * @param key Cache key
   * @param value Value to store
   * @param ttl Time to live in seconds (optional)
   */
  public async set(key: string, value: any, ttl?: number): Promise<void> {
    const expirationTime = ttl ?? this.defaultTTL;
    return await this.cacheManager.set(key, value, expirationTime);
  }

  /**
   * Delete a key from cache
   * @param key Cache key to delete
   */
  public async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * Get time to live for a key
   * @param key Cache key
   * @returns Time to live in seconds
   */
  public async ttl(key: string): Promise<number | undefined> {
    return await this.cacheManager.ttl(key);
  }

  /**
   * Clear all cache
   */
  public async reset(): Promise<void> {
    await this.cacheManager.clear();
  }
}
