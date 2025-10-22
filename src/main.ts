import 'dotenv/config';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';

import { setupSwagger } from '@src/utils/swagger.utils';

import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { ResolvePromisesInterceptor } from './utils/serializer.interceptor';
import validationOptions from './utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);
  const appConfig = configService.getOrThrow('app', {
    infer: true,
  });

  // Enhanced CORS configuration for multi-client support
  app.enableCors({
    origin: (
      origin: string,
      callback: (err: Error | null, success: boolean) => void,
    ) => {
      // Allow requests with no origin (mobile apps, desktop apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (appConfig.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // For development, allow localhost with any port
      if (
        appConfig.nodeEnv === 'development' &&
        origin.match(/^https?:\/\/localhost(:\d+)?$/)
      ) {
        return callback(null, true);
      }

      // Reject origin
      return callback(null, false);
    },
    credentials: true, // Allow cookies and authorization headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-custom-lang',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'], // Expose custom headers to clients
    maxAge: 86400, // Cache preflight response for 24 hours
  });

  app.enableShutdownHooks();
  app.setGlobalPrefix(appConfig.apiPrefix, {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(
    // ResolvePromisesInterceptor is used to resolve promises in responses because class-transformer can't do it
    // https://github.com/typestack/class-transformer/issues/549
    new ResolvePromisesInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  setupSwagger(app);
  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
