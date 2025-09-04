import { Module } from '@nestjs/common';

import { TranslatorsService } from './translators.service';
import { TranslatorsController } from './translators.controller';
import { RelationalTranslatorPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalTranslatorPersistenceModule],
  controllers: [TranslatorsController],
  providers: [TranslatorsService],
  exports: [TranslatorsService, RelationalTranslatorPersistenceModule],
})
export class TranslatorsModule {}
