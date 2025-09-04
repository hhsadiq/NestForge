import { Module } from '@nestjs/common';

import { ParagraphsService } from './paragraphs.service';
import { ParagraphsController } from './paragraphs.controller';
import { RelationalParagraphPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalParagraphPersistenceModule],
  controllers: [ParagraphsController],
  providers: [ParagraphsService],
  exports: [ParagraphsService, RelationalParagraphPersistenceModule],
})
export class ParagraphsModule {}
