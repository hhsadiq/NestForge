import { Tag } from '@src/tags/domain/tag';
import { TagEntity } from '@src/tags/infrastructure/persistence/relational/entities/tag.entity';

export class TagMapper {
  static toDomain(raw: TagEntity): Tag {
    const domainEntity = new Tag();
    domainEntity.name = raw.name;
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    return domainEntity;
  }

  static toDomainDTO(raw: TagEntity): Tag {
    const domainEntity = new Tag();
    domainEntity.name = raw.name;

    return domainEntity;
  }

  static toPersistence(domainEntity: Tag): TagEntity {
    const persistenceEntity = new TagEntity();
    persistenceEntity.name = domainEntity.name;
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
