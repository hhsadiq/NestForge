import { Poem } from '@src/poems/domain/poem';
import { PoemEntity } from '@src/poems/infrastructure/persistence/relational/entities/poem.entity';

export class PoemMapper {
  static toDomain(raw: PoemEntity): Poem {
    const domainEntity = new Poem();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.sectionId = raw.section_id;

    domainEntity.languageId = raw.language_id;

    domainEntity.position = raw.position;

    domainEntity.title = raw.title;

    domainEntity.slug = raw.slug;

    domainEntity.poemFormId = raw.poem_form_id;

    domainEntity.meterId = raw.meter_id;

    return domainEntity;
  }

  static toPersistence(domainEntity: Poem): PoemEntity {
    const persistenceEntity = new PoemEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.section_id = domainEntity.sectionId;

    persistenceEntity.language_id = domainEntity.languageId;

    persistenceEntity.position = domainEntity.position;

    persistenceEntity.title = domainEntity.title;

    persistenceEntity.slug = domainEntity.slug;

    persistenceEntity.poem_form_id = domainEntity.poemFormId;

    persistenceEntity.meter_id = domainEntity.meterId;

    return persistenceEntity;
  }
}
