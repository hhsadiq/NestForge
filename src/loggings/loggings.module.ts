import { Module, Global } from '@nestjs/common';

import { RequestContextService } from '@src/loggings/utils/request-context.service';

import { LoggingsService } from './loggings.service';

@Global()
@Module({
  providers: [LoggingsService, RequestContextService],
  exports: [LoggingsService, RequestContextService],
})
export class LoggingsModule {}
