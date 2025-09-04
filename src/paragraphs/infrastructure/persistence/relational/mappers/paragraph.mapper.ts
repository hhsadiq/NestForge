import { Paragraph } from '@src/paragraphs/domain/paragraph';
import { ParagraphEntity } from '@src/paragraphs/infrastructure/persistence/relational/entities/paragraph.entity';

export class ParagraphMapper {
  static toDomain(raw: ParagraphEntity): Paragraph {
    const domainEntity = new Paragraph();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.sectionId = raw.section_id;

    domainEntity.languageId = raw.language_id;

    domainEntity.position = raw.position;

    domainEntity.body = raw.body;

    return domainEntity;
  }

  static toPersistence(domainEntity: Paragraph): ParagraphEntity {
    const persistenceEntity = new ParagraphEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.section_id = domainEntity.sectionId;

    persistenceEntity.language_id = domainEntity.languageId;

    persistenceEntity.position = domainEntity.position;

    persistenceEntity.body = domainEntity.body;

    return persistenceEntity;
  }
}
