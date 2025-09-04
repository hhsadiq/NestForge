import { Module } from '@nestjs/common';

import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { RelationalTagPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalTagPersistenceModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService, RelationalTagPersistenceModule],
})
export class TagsModule {}
