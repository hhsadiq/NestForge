import { Module } from '@nestjs/common';

import { ParagraphTagsService } from './paragraph-tags.service';
import { ParagraphTagsController } from './paragraph-tags.controller';
import { RelationalParagraphTagPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalParagraphTagPersistenceModule],
  controllers: [ParagraphTagsController],
  providers: [ParagraphTagsService],
  exports: [ParagraphTagsService, RelationalParagraphTagPersistenceModule],
})
export class ParagraphTagsModule {}
