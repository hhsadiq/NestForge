import { PoemMedia } from '@src/poem-media/domain/poem-media';
import { PoemMediaEntity } from '@src/poem-media/infrastructure/persistence/relational/entities/poem-media.entity';

export class PoemMediaMapper {
  static toDomain(raw: PoemMediaEntity): PoemMedia {
    const domainEntity = new PoemMedia();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.poemId = raw.poem_id;

    domainEntity.mediaPlatformId = raw.media_platform_id;

    domainEntity.link = raw.link;

    domainEntity.note = raw.note;

    return domainEntity;
  }

  static toPersistence(domainEntity: PoemMedia): PoemMediaEntity {
    const persistenceEntity = new PoemMediaEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.poem_id = domainEntity.poemId;

    persistenceEntity.media_platform_id = domainEntity.mediaPlatformId;

    persistenceEntity.link = domainEntity.link;

    persistenceEntity.note = domainEntity.note;

    return persistenceEntity;
  }
}
