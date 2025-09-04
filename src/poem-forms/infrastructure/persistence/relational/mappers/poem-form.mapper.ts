import { PoemForm } from '@src/poem-forms/domain/poem-form';
import { PoemFormEntity } from '@src/poem-forms/infrastructure/persistence/relational/entities/poem-form.entity';

export class PoemFormMapper {
  static toDomain(raw: PoemFormEntity): PoemForm {
    const domainEntity = new PoemForm();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.name = raw.name;

    domainEntity.slug = raw.slug;

    domainEntity.note = raw.note;

    return domainEntity;
  }

  static toPersistence(domainEntity: PoemForm): PoemFormEntity {
    const persistenceEntity = new PoemFormEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.slug = domainEntity.slug;

    persistenceEntity.note = domainEntity.note;

    return persistenceEntity;
  }
}
