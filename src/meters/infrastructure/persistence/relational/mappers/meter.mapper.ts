import { Meter } from '@src/meters/domain/meter';
import { MeterEntity } from '@src/meters/infrastructure/persistence/relational/entities/meter.entity';

export class MeterMapper {
  static toDomain(raw: MeterEntity): Meter {
    const domainEntity = new Meter();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.name = raw.name;

    domainEntity.slug = raw.slug;

    domainEntity.note = raw.note;

    domainEntity.fileId = raw.file_id;

    return domainEntity;
  }

  static toPersistence(domainEntity: Meter): MeterEntity {
    const persistenceEntity = new MeterEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.slug = domainEntity.slug;

    persistenceEntity.note = domainEntity.note;

    persistenceEntity.file_id = domainEntity.fileId;

    return persistenceEntity;
  }
}
