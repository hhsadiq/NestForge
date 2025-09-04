import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { VerseAuthor } from '@src/verse-authors/domain/verse-author';

export abstract class VerseAuthorAbstractRepository {
  abstract create(
    data: Omit<VerseAuthor, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<VerseAuthor>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<VerseAuthor[]>;

  abstract findById(id: VerseAuthor['id']): Promise<NullableType<VerseAuthor>>;

  abstract update(
    id: VerseAuthor['id'],
    payload: DeepPartial<VerseAuthor>,
  ): Promise<VerseAuthor | null>;

  abstract remove(id: VerseAuthor['id']): Promise<void>;
}
