import { Module } from '@nestjs/common';

import { ClapsController } from './claps.controller';
import { ClapsService } from './claps.service';
import { RelationalClapPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalClapPersistenceModule],
  controllers: [ClapsController],
  providers: [ClapsService],
  exports: [ClapsService, RelationalClapPersistenceModule],
})
export class ClapsModule {}
