# Cache Module

---

## Table of Contents <!-- omit in toc -->

- [Overview](#overview)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [References](#references)

---

## Overview

The Cache Module provides Redis-powered caching for NestForge applications with support for both single-instance and cluster Redis deployments.

### Key Features

- **Redis Integration**: Built on `cache-manager-ioredis`
- **Cluster Support**: Automatic configuration for Redis cluster environments
- **TLS Security**: Automatic TLS configuration for production
- **Type Safety**: Full TypeScript support with generic type parameters
- **Global Module**: Available throughout the application

---

## Configuration

Configure Redis through environment variables:

```bash
# Redis Connection
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password_here

# Cache Settings
REDIS_DEFAULT_TTL=3600  # Default TTL in seconds (1 hour)

# Cluster Configuration
REDIS_IS_CLUSTER_MODE=false
```

---

## API Reference

### CacheService Methods

#### `get<T>(key: string): Promise<T | null>`

Retrieves a value from the cache.

#### `set(key: string, value: any, ttl?: number): Promise<void>`

Stores a value in the cache with optional TTL.

#### `del(key: string): Promise<void>`

Deletes a key from the cache.

#### `ttl(key: string): Promise<number | undefined>`

Gets the time to live for a key.

#### `reset(): Promise<void>`

Clears all cache entries.

### Cache Keys Management

Use the `CACHE_KEYS` constant for centralized cache key management:

```typescript
// src/cache/cache.keys.const.ts
export const CACHE_KEYS = {
  USER: (id: string) => `user:${id}`,
  USER_SESSIONS: (userId: string) => `user:${userId}:sessions`,
  API_RATE_LIMIT: (ip: string) => `rate_limit:${ip}`,
  FEATURE_FLAGS: 'feature_flags',
} as const;
```

### TTL Management

Use the `TTL` constant for centralized cache key management:

```typescript
const TTL = {
  USER_PROFILE: 3600, // 1 hour - relatively static
  USER_SESSION: 1800, // 30 minutes - security sensitive
  API_RESPONSE: 300, // 5 minutes - frequently changing
  STATIC_CONFIG: 86400, // 24 hours - rarely changes
} as const;
```

---

## Usage Examples

### Basic Usage

```typescript
import { Injectable } from '@nestjs/common';
import { CacheService } from '@src/cache/cache.service';
import CACHE_KEYS from '@src/cache/cache.consts';
import TTL from '@src/cache/cache.consts';

@Injectable()
export class UserService {
  constructor(private readonly cacheService: CacheService) {}

  async findById(id: string): Promise<User | null> {
    // Try cache first
    const cachedUser = await this.cacheService.get<User>(CACHE_KEYS.USER(id));
    if (cachedUser) {
      return cachedUser;
    }

    // Fetch from database
    const user = await this.userRepository.findById(id);
    if (user) {
      // Cache for 1 hour
      await this.cacheService.set(`user:${id}`, user, TTL.USER);
    }

    return user;
  }
}
```

---

## References

- [NestJS Cache Manager](https://docs.nestjs.com/techniques/caching)
- [Redis Documentation](https://redis.io/documentation)
- [cache-manager-ioredis](https://github.com/dabroek/node-cache-manager-ioredis)

---

Previous: [Database](database.md)

Next: [Auth](auth.md)
