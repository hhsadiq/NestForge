import { PoemTag } from '@src/poem-tags/domain/poem-tag';
import { PoemTagEntity } from '@src/poem-tags/infrastructure/persistence/relational/entities/poem-tag.entity';

export class PoemTagMapper {
  static toDomain(raw: PoemTagEntity): PoemTag {
    const domainEntity = new PoemTag();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.poemId = raw.poem_id;

    domainEntity.tagId = raw.tag_id;

    return domainEntity;
  }

  static toPersistence(domainEntity: PoemTag): PoemTagEntity {
    const persistenceEntity = new PoemTagEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.poem_id = domainEntity.poemId;

    persistenceEntity.tag_id = domainEntity.tagId;

    return persistenceEntity;
  }
}
