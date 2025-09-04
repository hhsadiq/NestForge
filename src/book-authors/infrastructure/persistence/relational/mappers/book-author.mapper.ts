import { BookAuthor } from '@src/book-authors/domain/book-author';
import { BookAuthorEntity } from '@src/book-authors/infrastructure/persistence/relational/entities/book-author.entity';

export class BookAuthorMapper {
  static toDomain(raw: BookAuthorEntity): BookAuthor {
    const domainEntity = new BookAuthor();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.bookId = raw.book_id;

    domainEntity.authorId = raw.author_id;

    domainEntity.position = raw.position;

    domainEntity.role = raw.role;

    return domainEntity;
  }

  static toPersistence(domainEntity: BookAuthor): BookAuthorEntity {
    const persistenceEntity = new BookAuthorEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.book_id = domainEntity.bookId;

    persistenceEntity.author_id = domainEntity.authorId;

    persistenceEntity.position = domainEntity.position;

    persistenceEntity.role = domainEntity.role;

    return persistenceEntity;
  }
}
