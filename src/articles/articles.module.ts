import { Module } from '@nestjs/common';

import { CommentsModule } from '@src/comments/comments.module';
import { DatabaseHelperModule } from '@src/database-helpers/database-helper.module';
import { GenAiModule } from '@src/gen-ai/gen-ai.module';
import { TagsModule } from '@src/tags/tags.module';
import { UsersModule } from '@src/users/users.module';

import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { RelationalArticlePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalArticlePersistenceModule,
    UsersModule,
    CommentsModule,
    TagsModule,
    DatabaseHelperModule,
    GenAiModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService, RelationalArticlePersistenceModule],
})
export class ArticlesModule {}
