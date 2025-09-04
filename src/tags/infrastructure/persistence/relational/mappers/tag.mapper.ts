import { Tag } from '@src/tags/domain/tag';
import { TagEntity } from '@src/tags/infrastructure/persistence/relational/entities/tag.entity';

export class TagMapper {
  static toDomain(raw: TagEntity): Tag {
    const domainEntity = new Tag();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.name = raw.name;

    domainEntity.slug = raw.slug;

    domainEntity.description = raw.description;

    return domainEntity;
  }

  static toPersistence(domainEntity: Tag): TagEntity {
    const persistenceEntity = new TagEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.slug = domainEntity.slug;

    persistenceEntity.description = domainEntity.description;

    return persistenceEntity;
  }
}
