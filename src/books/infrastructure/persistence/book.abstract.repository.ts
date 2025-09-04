import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Book } from '@src/books/domain/book';

export abstract class BookAbstractRepository {
  abstract create(
    data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Book[]>;

  abstract findById(id: Book['id']): Promise<NullableType<Book>>;

  abstract update(
    id: Book['id'],
    payload: DeepPartial<Book>,
  ): Promise<Book | null>;

  abstract remove(id: Book['id']): Promise<void>;
}
