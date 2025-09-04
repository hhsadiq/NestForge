import { Module } from '@nestjs/common';

import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { RelationalAuthorPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalAuthorPersistenceModule],
  controllers: [AuthorsController],
  providers: [AuthorsService],
  exports: [AuthorsService, RelationalAuthorPersistenceModule],
})
export class AuthorsModule {}
