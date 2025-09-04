import { Module } from '@nestjs/common';

import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { RelationalTranslationPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalTranslationPersistenceModule],
  controllers: [TranslationsController],
  providers: [TranslationsService],
  exports: [TranslationsService, RelationalTranslationPersistenceModule],
})
export class TranslationsModule {}
