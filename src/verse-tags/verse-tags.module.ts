import { Module } from '@nestjs/common';

import { VerseTagsService } from './verse-tags.service';
import { VerseTagsController } from './verse-tags.controller';
import { RelationalVerseTagPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalVerseTagPersistenceModule],
  controllers: [VerseTagsController],
  providers: [VerseTagsService],
  exports: [VerseTagsService, RelationalVerseTagPersistenceModule],
})
export class VerseTagsModule {}
