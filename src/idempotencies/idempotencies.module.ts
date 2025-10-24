import { Module } from '@nestjs/common';

import { IdempotenciesService } from './idempotencies.service';

@Module({
  providers: [IdempotenciesService],
  exports: [IdempotenciesService],
})
export class IdempotenciesModule {}
