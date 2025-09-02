import { Module } from '@nestjs/common';

import { UsersModule } from '@src/users/users.module';

import { CommentsService } from './comments.service';
import { RelationalCommentPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalCommentPersistenceModule, UsersModule],
  providers: [CommentsService],
  exports: [CommentsService, RelationalCommentPersistenceModule],
})
export class CommentsModule {}
