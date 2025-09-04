import { Author } from '@src/authors/domain/author';
import { AuthorEntity } from '@src/authors/infrastructure/persistence/relational/entities/author.entity';

export class AuthorMapper {
  static toDomain(raw: AuthorEntity): Author {
    const domainEntity = new Author();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.displayName = raw.display_name;

    domainEntity.sortName = raw.sort_name;

    domainEntity.bio = raw.bio;

    domainEntity.slug = raw.slug;

    domainEntity.email = raw.email;

    return domainEntity;
  }

  static toPersistence(domainEntity: Author): AuthorEntity {
    const persistenceEntity = new AuthorEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.display_name = domainEntity.displayName;

    persistenceEntity.sort_name = domainEntity.sortName;

    persistenceEntity.bio = domainEntity.bio;

    persistenceEntity.slug = domainEntity.slug;

    persistenceEntity.email = domainEntity.email;

    return persistenceEntity;
  }
}
