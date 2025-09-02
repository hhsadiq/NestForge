import { FavoriteArticle } from '@src/articles/domain/favorite-article';
import { ArticleEntity } from '@src/articles/infrastructure/persistence/relational/entities/article.entity';
import { FavoriteArticleEntity } from '@src/articles/infrastructure/persistence/relational/entities/favorite-article.entity';
import { ArticleMapper } from '@src/articles/infrastructure/persistence/relational/mappers/article.mapper';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';

export class FavoriteArticleMapper {
  static toDomain(raw: FavoriteArticleEntity): FavoriteArticle {
    const domainEntity = new FavoriteArticle();
    domainEntity.id = raw.id;
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    if (raw.article) {
      domainEntity.article = ArticleMapper.toDomain(raw.article);
    }

    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: FavoriteArticle): FavoriteArticleEntity {
    const persistenceEntity = new FavoriteArticleEntity();

    persistenceEntity.id = domainEntity.id;

    if (domainEntity.user) {
      persistenceEntity.user = new UserEntity();
      persistenceEntity.user.id = Number(domainEntity.user.id);
    }

    if (domainEntity.article) {
      persistenceEntity.article = new ArticleEntity();
      persistenceEntity.article.id = domainEntity.article.id;
    }

    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;
    return persistenceEntity;
  }
}
