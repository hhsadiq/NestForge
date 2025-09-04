import { Language } from '@src/languages/domain/language';
import { LanguageEntity } from '@src/languages/infrastructure/persistence/relational/entities/language.entity';

export class LanguageMapper {
  static toDomain(raw: LanguageEntity): Language {
    const domainEntity = new Language();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.code = raw.code;

    domainEntity.name = raw.name;

    domainEntity.direction = raw.direction;

    domainEntity.slug = raw.slug;

    return domainEntity;
  }

  static toPersistence(domainEntity: Language): LanguageEntity {
    const persistenceEntity = new LanguageEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.code = domainEntity.code;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.direction = domainEntity.direction;

    persistenceEntity.slug = domainEntity.slug;

    return persistenceEntity;
  }
}
