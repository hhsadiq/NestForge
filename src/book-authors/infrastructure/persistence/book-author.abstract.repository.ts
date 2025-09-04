import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { BookAuthor } from '@src/book-authors/domain/book-author';

export abstract class BookAuthorAbstractRepository {
  abstract create(
    data: Omit<BookAuthor, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<BookAuthor>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<BookAuthor[]>;

  abstract findById(id: BookAuthor['id']): Promise<NullableType<BookAuthor>>;

  abstract update(
    id: BookAuthor['id'],
    payload: DeepPartial<BookAuthor>,
  ): Promise<BookAuthor | null>;

  abstract remove(id: BookAuthor['id']): Promise<void>;
}
