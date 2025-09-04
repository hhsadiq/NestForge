import { FeedbackPreset } from '@src/feedback-presets/domain/feedback-preset';
import { FeedbackPresetEntity } from '@src/feedback-presets/infrastructure/persistence/relational/entities/feedback-preset.entity';

export class FeedbackPresetMapper {
  static toDomain(raw: FeedbackPresetEntity): FeedbackPreset {
    const domainEntity = new FeedbackPreset();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.code = raw.code;

    domainEntity.name = raw.name;

    domainEntity.note = raw.note;

    return domainEntity;
  }

  static toPersistence(domainEntity: FeedbackPreset): FeedbackPresetEntity {
    const persistenceEntity = new FeedbackPresetEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.code = domainEntity.code;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.note = domainEntity.note;

    return persistenceEntity;
  }
}
