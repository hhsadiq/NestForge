import { Translator } from '@src/translators/domain/translator';
import { TranslatorEntity } from '@src/translators/infrastructure/persistence/relational/entities/translator.entity';

export class TranslatorMapper {
  static toDomain(raw: TranslatorEntity): Translator {
    const domainEntity = new Translator();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.translatorType = raw.translator_type;

    domainEntity.displayName = raw.display_name;

    domainEntity.sortName = raw.sort_name;

    domainEntity.bio = raw.bio;

    domainEntity.note = raw.note;

    domainEntity.slug = raw.slug;

    domainEntity.llmProviderName = raw.llm_provider_name;

    domainEntity.llmProviderSlug = raw.llm_provider_slug;

    domainEntity.llmProviderWebsite = raw.llm_provider_website;

    domainEntity.llmModelName = raw.llm_model_name;

    domainEntity.llmModelSlug = raw.llm_model_slug;

    domainEntity.llmModelVersion = raw.llm_model_version;

    domainEntity.llmModelFamily = raw.llm_model_family;

    return domainEntity;
  }

  static toPersistence(domainEntity: Translator): TranslatorEntity {
    const persistenceEntity = new TranslatorEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.translator_type = domainEntity.translatorType;

    persistenceEntity.display_name = domainEntity.displayName;

    persistenceEntity.sort_name = domainEntity.sortName;

    persistenceEntity.bio = domainEntity.bio;

    persistenceEntity.note = domainEntity.note;

    persistenceEntity.slug = domainEntity.slug;

    persistenceEntity.llm_provider_name = domainEntity.llmProviderName;

    persistenceEntity.llm_provider_slug = domainEntity.llmProviderSlug;

    persistenceEntity.llm_provider_website = domainEntity.llmProviderWebsite;

    persistenceEntity.llm_model_name = domainEntity.llmModelName;

    persistenceEntity.llm_model_slug = domainEntity.llmModelSlug;

    persistenceEntity.llm_model_version = domainEntity.llmModelVersion;

    persistenceEntity.llm_model_family = domainEntity.llmModelFamily;

    return persistenceEntity;
  }
}
