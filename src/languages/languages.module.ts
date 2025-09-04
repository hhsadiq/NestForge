import { Module } from '@nestjs/common';

import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { RelationalLanguagePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalLanguagePersistenceModule],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService, RelationalLanguagePersistenceModule],
})
export class LanguagesModule {}
