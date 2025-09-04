import { Module } from '@nestjs/common';

import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { RelationalBookPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalBookPersistenceModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService, RelationalBookPersistenceModule],
})
export class BooksModule {}
