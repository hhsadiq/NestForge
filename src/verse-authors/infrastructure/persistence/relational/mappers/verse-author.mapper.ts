import { VerseAuthor } from '@src/verse-authors/domain/verse-author';
import { VerseAuthorEntity } from '@src/verse-authors/infrastructure/persistence/relational/entities/verse-author.entity';

export class VerseAuthorMapper {
  static toDomain(raw: VerseAuthorEntity): VerseAuthor {
    const domainEntity = new VerseAuthor();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.verseId = raw.verse_id;

    domainEntity.authorId = raw.author_id;

    domainEntity.position = raw.position;

    domainEntity.role = raw.role;

    return domainEntity;
  }

  static toPersistence(domainEntity: VerseAuthor): VerseAuthorEntity {
    const persistenceEntity = new VerseAuthorEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.verse_id = domainEntity.verseId;

    persistenceEntity.author_id = domainEntity.authorId;

    persistenceEntity.position = domainEntity.position;

    persistenceEntity.role = domainEntity.role;

    return persistenceEntity;
  }
}
