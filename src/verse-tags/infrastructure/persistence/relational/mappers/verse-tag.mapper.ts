import { VerseTag } from '@src/verse-tags/domain/verse-tag';
import { VerseTagEntity } from '@src/verse-tags/infrastructure/persistence/relational/entities/verse-tag.entity';

export class VerseTagMapper {
  static toDomain(raw: VerseTagEntity): VerseTag {
    const domainEntity = new VerseTag();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.verseId = raw.verse_id;

    domainEntity.tagId = raw.tag_id;

    return domainEntity;
  }

  static toPersistence(domainEntity: VerseTag): VerseTagEntity {
    const persistenceEntity = new VerseTagEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.verse_id = domainEntity.verseId;

    persistenceEntity.tag_id = domainEntity.tagId;

    return persistenceEntity;
  }
}
