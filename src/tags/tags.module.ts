import { Module } from '@nestjs/common';

import { RelationalTagPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [RelationalTagPersistenceModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService, RelationalTagPersistenceModule],
})
export class TagsModule {}
