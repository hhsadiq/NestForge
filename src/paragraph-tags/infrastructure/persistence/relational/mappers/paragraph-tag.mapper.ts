import { ParagraphTag } from '@src/paragraph-tags/domain/paragraph-tag';
import { ParagraphTagEntity } from '@src/paragraph-tags/infrastructure/persistence/relational/entities/paragraph-tag.entity';

export class ParagraphTagMapper {
  static toDomain(raw: ParagraphTagEntity): ParagraphTag {
    const domainEntity = new ParagraphTag();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.paragraphId = raw.paragraph_id;

    domainEntity.tagId = raw.tag_id;

    return domainEntity;
  }

  static toPersistence(domainEntity: ParagraphTag): ParagraphTagEntity {
    const persistenceEntity = new ParagraphTagEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.paragraph_id = domainEntity.paragraphId;

    persistenceEntity.tag_id = domainEntity.tagId;

    return persistenceEntity;
  }
}
