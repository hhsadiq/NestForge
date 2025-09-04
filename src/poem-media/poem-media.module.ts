import { Module } from '@nestjs/common';

import { PoemMediaService } from './poem-media.service';
import { PoemMediaController } from './poem-media.controller';
import { RelationalPoemMediaPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalPoemMediaPersistenceModule],
  controllers: [PoemMediaController],
  providers: [PoemMediaService],
  exports: [PoemMediaService, RelationalPoemMediaPersistenceModule],
})
export class PoemMediaModule {}
