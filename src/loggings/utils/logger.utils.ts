import { INestApplication } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';

import { LoggingsService } from '@src/loggings/loggings.service';

export function configureLogger(
  app: INestApplication,
  loggerService: LoggingsService,
) {
  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getInstance();

  const originalSend = instance.response.send;
  instance.response.send = function (body) {
    (this as any).__custombody__ = body;
    return originalSend.call(this, body);
  };

  morgan.token('res-body', (_req, res: any) => {
    return res?.__custombody__ ?? '';
  });

  morgan.token('correlation-id', (req) => req.headers['x-correlation-id']);
  morgan.token('user-id', (req) =>
    extractUserIdFromToken(req.headers.authorization),
  );

  morgan.token('content-type', (req) => req.headers['content-type'] || '');
  morgan.token(
    'x-idempotency-key',
    (req) => req.headers['x-idempotency-key'] || '',
  );
  morgan.token('user-agent', (req) => req.headers['user-agent-mobile'] || '');
  morgan.token('app-version', (req) => req.headers['app-version'] || '');
  morgan.token('platform', (req) => req.headers['platform'] || '');

  const logger = loggerService.getLogger();

  app.use(
    morgan((tokens, req, res) => {
      const url = tokens.url(req, res);

      // **Skip logging for the root URL `/`**
      if (url === '/') {
        return null;
      }

      const method = tokens.method(req, res);
      const status = tokens.status(req, res);
      const responseTime = tokens['response-time'](req, res);
      const requestBody = loggerService.sanitizePayload(req.body);
      const rawResponse = tokens['res-body'](req, res)?.trim();
      const responseBody = loggerService.sanitizePayload(
        rawResponse?.startsWith('{') || rawResponse?.startsWith('[')
          ? JSON.parse(tokens['res-body'](req, res))
          : tokens['res-body'](req, res),
      );
      const correlationId = tokens['correlation-id'](req, res);
      const userId = tokens['user-id'](req, res);
      const clientIp =
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.socket.remoteAddress ||
        req.ip;

      const xIdempotentKey = tokens['x-idempotency-key'](req, res);
      const contentType = tokens['content-type'](req, res);
      const userAgent = tokens['user-agent'](req, res);
      const appVersion = tokens['app-version'](req, res);
      const platform = tokens['platform'](req, res);

      logger.info('HTTP request/response', {
        method,
        url,
        status,
        responseTime,
        requestBody,
        responseBody,
        correlationId,
        userId,
        clientIp,
        contentType,
        userAgent,
        appVersion,
        platform,
        xIdempotentKey,
      });

      return null;
    }),
  );
}

export function extractUserIdFromToken(authHeader?: string): string {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return 'N/A';
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.decode(token);
    // Ensure decoded payload has `userId`
    return decoded?.id || 'N/A';
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return 'N/A';
  }
}
