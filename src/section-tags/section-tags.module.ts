import { Module } from '@nestjs/common';

import { SectionTagsService } from './section-tags.service';
import { SectionTagsController } from './section-tags.controller';
import { RelationalSectionTagPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalSectionTagPersistenceModule],
  controllers: [SectionTagsController],
  providers: [SectionTagsService],
  exports: [SectionTagsService, RelationalSectionTagPersistenceModule],
})
export class SectionTagsModule {}
