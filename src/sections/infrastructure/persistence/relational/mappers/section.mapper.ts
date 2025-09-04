import { Section } from '@src/sections/domain/section';
import { SectionEntity } from '@src/sections/infrastructure/persistence/relational/entities/section.entity';

export class SectionMapper {
  static toDomain(raw: SectionEntity): Section {
    const domainEntity = new Section();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.bookId = raw.book_id;

    domainEntity.parentSectionId = raw.parent_section_id;

    domainEntity.title = raw.title;

    domainEntity.position = raw.position;

    domainEntity.slug = raw.slug;

    return domainEntity;
  }

  static toPersistence(domainEntity: Section): SectionEntity {
    const persistenceEntity = new SectionEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.book_id = domainEntity.bookId;

    persistenceEntity.parent_section_id = domainEntity.parentSectionId;

    persistenceEntity.title = domainEntity.title;

    persistenceEntity.position = domainEntity.position;

    persistenceEntity.slug = domainEntity.slug;

    return persistenceEntity;
  }
}
