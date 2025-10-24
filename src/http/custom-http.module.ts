import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggingsModule } from '@src/loggings/loggings.module';

import { LoggingHttpService } from './logging-http.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timeout: configService.get<number>('http.reqTimeout', {
          infer: true,
        }) as number,
        maxRedirects: configService.get<number>('http.maxRedirects', {
          infer: true,
        }) as number,
      }),
    }),
    LoggingsModule,
  ],
  providers: [LoggingHttpService],
  exports: [HttpModule, LoggingHttpService],
})
export class CustomHttpModule {}
