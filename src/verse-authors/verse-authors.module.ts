import { Module } from '@nestjs/common';

import { VerseAuthorsService } from './verse-authors.service';
import { VerseAuthorsController } from './verse-authors.controller';
import { RelationalVerseAuthorPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalVerseAuthorPersistenceModule],
  controllers: [VerseAuthorsController],
  providers: [VerseAuthorsService],
  exports: [VerseAuthorsService, RelationalVerseAuthorPersistenceModule],
})
export class VerseAuthorsModule {}
