import { Clap } from '@src/articles/domain/clap';
import { ArticleEntity } from '@src/articles/infrastructure/persistence/relational/entities/article.entity';
import { ClapEntity } from '@src/articles/infrastructure/persistence/relational/entities/clap.entity';
import { ArticleMapper } from '@src/articles/infrastructure/persistence/relational/mappers/article.mapper';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';

export class ClapMapper {
  static toDomain(raw: ClapEntity): Clap {
    const domainEntity = new Clap();
    domainEntity.id = raw.id;
    domainEntity.counter = raw.counter;

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

  static toPersistence(domainEntity: Partial<Clap>): Partial<ClapEntity> {
    const persistenceEntity = new ClapEntity();

    if (domainEntity.id !== undefined) {
      persistenceEntity.id = domainEntity.id;
    }
    if (domainEntity.counter !== undefined) {
      persistenceEntity.counter = domainEntity.counter;
    }

    if (domainEntity.user) {
      persistenceEntity.user = new UserEntity();
      persistenceEntity.user.id = Number(domainEntity.user.id);
    }

    if (domainEntity.article) {
      persistenceEntity.article = new ArticleEntity();
      persistenceEntity.article.id = domainEntity.article.id;
    }

    if (domainEntity.createdAt) {
      persistenceEntity.created_at = domainEntity.createdAt;
    }
    if (domainEntity.updatedAt) {
      persistenceEntity.updated_at = domainEntity.updatedAt;
    }

    return persistenceEntity;
  }
}
