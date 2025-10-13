import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuth from 'express-basic-auth';

import { AllConfigType } from '@src/config/config.type';

const SWAGGER_PATH = 'docs';

export const setupSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService<AllConfigType>);
  const appConfig = configService.getOrThrow('app', { infer: true });

  if (appConfig.nodeEnv !== 'local') {
    const users = {};
    users[appConfig.swaggerUsername] = appConfig.swaggerPassword;

    app.use(
      [`/${SWAGGER_PATH}`, `/${SWAGGER_PATH}-json`],
      basicAuth({
        challenge: true,
        users,
      }),
    );
  }

  const options = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_PATH, app, document);
};
