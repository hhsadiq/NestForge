import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';

import { AllConfigType } from '@src/config/config.type';

import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const redisConfig = configService.getOrThrow('redis', { infer: true });
        const nodeEnv = configService.getOrThrow('app.nodeEnv', {
          infer: true,
        });

        const commonOptions = {
          store: redisStore,
          ttl: redisConfig.defaultTTL,
        };

        if (redisConfig.isClusterMode) {
          const redisNodes = [
            {
              host: redisConfig.redisHost,
              port: redisConfig.redisPort,
            },
          ];

          return {
            ...commonOptions,
            clusterConfig: {
              nodes: redisNodes,
              options: {
                dnsLookup: (address, callback) => callback(null, address),
                redisOptions: {
                  tls: {}, // Required for AWS ElastiCache
                  ...(redisConfig.password && {
                    password: redisConfig.password,
                  }),
                },
              },
            },
          };
        }

        // For non-cluster mode
        return {
          ...commonOptions,
          host: redisConfig.redisHost,
          port: redisConfig.redisPort,
          ...(redisConfig.password && { password: redisConfig.password }),
          ...(nodeEnv !== 'local' && { tls: {} }), // Only use TLS outside local
        } as any;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, NestCacheModule],
})
export class CacheModule {}
