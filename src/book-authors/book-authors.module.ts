import { Module } from '@nestjs/common';

import { BookAuthorsService } from './book-authors.service';
import { BookAuthorsController } from './book-authors.controller';
import { RelationalBookAuthorPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalBookAuthorPersistenceModule],
  controllers: [BookAuthorsController],
  providers: [BookAuthorsService],
  exports: [BookAuthorsService, RelationalBookAuthorPersistenceModule],
})
export class BookAuthorsModule {}
