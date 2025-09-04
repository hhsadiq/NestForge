import { MediaPlatform } from '@src/media-platforms/domain/media-platform';
import { MediaPlatformEntity } from '@src/media-platforms/infrastructure/persistence/relational/entities/media-platform.entity';

export class MediaPlatformMapper {
  static toDomain(raw: MediaPlatformEntity): MediaPlatform {
    const domainEntity = new MediaPlatform();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.code = raw.code;

    domainEntity.name = raw.name;

    domainEntity.slug = raw.slug;

    domainEntity.baseUrl = raw.base_url;

    domainEntity.note = raw.note;

    return domainEntity;
  }

  static toPersistence(domainEntity: MediaPlatform): MediaPlatformEntity {
    const persistenceEntity = new MediaPlatformEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.code = domainEntity.code;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.slug = domainEntity.slug;

    persistenceEntity.base_url = domainEntity.baseUrl;

    persistenceEntity.note = domainEntity.note;

    return persistenceEntity;
  }
}
