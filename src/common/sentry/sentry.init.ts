import * as os from 'os';

import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { SentryFilter } from '@src/common/sentry/sentry.filter';
import { AllConfigType } from '@src/config/config.type';

export function initializeSentry(app: INestApplication): void {
  const configService = app.get(ConfigService<AllConfigType>);

  Sentry.init({
    dsn: configService.getOrThrow('app.sentryUrl', { infer: true }),
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    environment: configService.getOrThrow('app.nodeEnv', { infer: true }),
    serverName: os.hostname(),
  });

  Sentry.getCurrentScope().setTag(
    'service',
    configService.getOrThrow('app.name', { infer: true }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter, configService));
}
