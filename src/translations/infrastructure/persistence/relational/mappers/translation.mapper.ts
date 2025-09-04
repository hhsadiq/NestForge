import { Translation } from '@src/translations/domain/translation';
import { TranslationEntity } from '@src/translations/infrastructure/persistence/relational/entities/translation.entity';

export class TranslationMapper {
  static toDomain(raw: TranslationEntity): Translation {
    const domainEntity = new Translation();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.paragraphId = raw.paragraph_id;

    domainEntity.verseId = raw.verse_id;

    domainEntity.languageId = raw.language_id;

    domainEntity.translatorId = raw.translator_id;

    domainEntity.body = raw.body;

    domainEntity.version = raw.version;

    domainEntity.isPrimary = raw.is_primary;

    domainEntity.note = raw.note;

    domainEntity.workflowStatusId = raw.workflow_status_id;

    domainEntity.sourceTranslationId = raw.source_translation_id;

    domainEntity.generationMeta = raw.generation_meta;

    return domainEntity;
  }

  static toPersistence(domainEntity: Translation): TranslationEntity {
    const persistenceEntity = new TranslationEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.paragraph_id = domainEntity.paragraphId;

    persistenceEntity.verse_id = domainEntity.verseId;

    persistenceEntity.language_id = domainEntity.languageId;

    persistenceEntity.translator_id = domainEntity.translatorId;

    persistenceEntity.body = domainEntity.body;

    persistenceEntity.version = domainEntity.version;

    persistenceEntity.is_primary = domainEntity.isPrimary;

    persistenceEntity.note = domainEntity.note;

    persistenceEntity.workflow_status_id = domainEntity.workflowStatusId;

    persistenceEntity.source_translation_id = domainEntity.sourceTranslationId;

    persistenceEntity.generation_meta = domainEntity.generationMeta;

    return persistenceEntity;
  }
}
