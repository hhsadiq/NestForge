import { Module } from '@nestjs/common';

import { VersesService } from './verses.service';
import { VersesController } from './verses.controller';
import { RelationalVersePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalVersePersistenceModule],
  controllers: [VersesController],
  providers: [VersesService],
  exports: [VersesService, RelationalVersePersistenceModule],
})
export class VersesModule {}
