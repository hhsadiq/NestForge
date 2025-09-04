import { Book } from '@src/books/domain/book';
import { BookEntity } from '@src/books/infrastructure/persistence/relational/entities/book.entity';

export class BookMapper {
  static toDomain(raw: BookEntity): Book {
    const domainEntity = new Book();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.title = raw.title;

    domainEntity.originalLanguageId = raw.original_language_id;

    domainEntity.description = raw.description;

    domainEntity.publishedYear = raw.published_year;

    domainEntity.slug = raw.slug;

    return domainEntity;
  }

  static toPersistence(domainEntity: Book): BookEntity {
    const persistenceEntity = new BookEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.title = domainEntity.title;

    persistenceEntity.original_language_id = domainEntity.originalLanguageId;

    persistenceEntity.description = domainEntity.description;

    persistenceEntity.published_year = domainEntity.publishedYear;

    persistenceEntity.slug = domainEntity.slug;

    return persistenceEntity;
  }
}
