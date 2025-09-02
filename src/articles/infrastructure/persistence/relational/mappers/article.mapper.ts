import { isArray, isEmpty, isNumber } from 'radash';

import { ArticleDTOWithTagDomains } from '@src/articles/articles.types';
import { Article } from '@src/articles/domain/article';
import { ArticleEntity } from '@src/articles/infrastructure/persistence/relational/entities/article.entity';
import { TagEntity } from '@src/tags/infrastructure/persistence/relational/entities/tag.entity';
import { TagMapper } from '@src/tags/infrastructure/persistence/relational/mappers/tag.mapper';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';

export class ArticleMapper {
  static toDomain(raw: ArticleEntity): Article {
    const domainEntity = new Article();
    domainEntity.body = raw.body;
    domainEntity.description = raw.description;
    domainEntity.title = raw.title;
    domainEntity.slug = raw.slug;
    domainEntity.id = raw.id;
    if (raw.author) {
      domainEntity.author = UserMapper.toDomain(raw.author);
    }
    if (isArray(raw.tagList) && !isEmpty(raw.tagList)) {
      domainEntity.tagList = raw.tagList?.map(
        (tagEntity: TagEntity) => tagEntity.name,
      );
    }

    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: Article): ArticleEntity {
    const persistenceEntity = new ArticleEntity();
    persistenceEntity.body = domainEntity.body;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.slug = domainEntity.slug;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    if (isNumber(domainEntity.authorId)) {
      persistenceEntity.author_id = domainEntity.authorId;
    }

    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    return persistenceEntity;
  }

  static toPersistenceFromDTOWithTagDomains(
    domainEntity: ArticleDTOWithTagDomains,
  ): ArticleEntity {
    const persistenceEntity = new ArticleEntity();
    persistenceEntity.body = domainEntity.body;
    persistenceEntity.description = domainEntity.description;
    persistenceEntity.title = domainEntity.title;
    persistenceEntity.slug = domainEntity.slug;

    if (isArray(domainEntity.tagList) && !isEmpty(domainEntity.tagList)) {
      persistenceEntity.tagList = domainEntity.tagList.map((domainEntity) =>
        TagMapper.toPersistence(domainEntity),
      );
    }

    if (isNumber(domainEntity.authorId)) {
      persistenceEntity.author_id = domainEntity.authorId;
    }

    return persistenceEntity;
  }
}
