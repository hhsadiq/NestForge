import { Module } from '@nestjs/common';

import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { RelationalSectionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalSectionPersistenceModule],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports: [SectionsService, RelationalSectionPersistenceModule],
})
export class SectionsModule {}
