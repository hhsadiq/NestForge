import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleAbstractRepository } from '@src/articles/infrastructure/persistence/article.abstract.repository';
import { FavoriteArticleEntity as ArticleFavoriteEntity } from '@src/articles/infrastructure/persistence/relational/entities/favorite-article.entity';
import { UserFollowEntity as UserFollowEntity } from '@src/users/infrastructure/persistence/relational/entities/user-follow.entity';

import { ArticleEntity } from './entities/article.entity';
import { ClapEntity } from './entities/clap.entity';
import { ArticleRelationalRepository } from './repositories/article.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      ArticleFavoriteEntity,
      UserFollowEntity,
      ClapEntity,
    ]),
  ],
  providers: [
    {
      provide: ArticleAbstractRepository,
      useClass: ArticleRelationalRepository,
    },
  ],
  exports: [ArticleAbstractRepository],
})
export class RelationalArticlePersistenceModule {}
