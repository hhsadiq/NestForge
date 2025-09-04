import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Author } from '@src/authors/domain/author';

export abstract class AuthorAbstractRepository {
  abstract create(
    data: Omit<Author, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Author>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Author[]>;

  abstract findById(id: Author['id']): Promise<NullableType<Author>>;

  abstract update(
    id: Author['id'],
    payload: DeepPartial<Author>,
  ): Promise<Author | null>;

  abstract remove(id: Author['id']): Promise<void>;
}
