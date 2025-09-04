import { SectionTag } from '@src/section-tags/domain/section-tag';
import { SectionTagEntity } from '@src/section-tags/infrastructure/persistence/relational/entities/section-tag.entity';

export class SectionTagMapper {
  static toDomain(raw: SectionTagEntity): SectionTag {
    const domainEntity = new SectionTag();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.sectionId = raw.section_id;

    domainEntity.tagId = raw.tag_id;

    return domainEntity;
  }

  static toPersistence(domainEntity: SectionTag): SectionTagEntity {
    const persistenceEntity = new SectionTagEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.section_id = domainEntity.sectionId;

    persistenceEntity.tag_id = domainEntity.tagId;

    return persistenceEntity;
  }
}
