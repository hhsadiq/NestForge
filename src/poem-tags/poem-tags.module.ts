import { Module } from '@nestjs/common';

import { PoemTagsService } from './poem-tags.service';
import { PoemTagsController } from './poem-tags.controller';
import { RelationalPoemTagPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalPoemTagPersistenceModule],
  controllers: [PoemTagsController],
  providers: [PoemTagsService],
  exports: [PoemTagsService, RelationalPoemTagPersistenceModule],
})
export class PoemTagsModule {}
