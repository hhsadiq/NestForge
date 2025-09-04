import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { VerseTag } from '@src/verse-tags/domain/verse-tag';

export abstract class VerseTagAbstractRepository {
  abstract create(
    data: Omit<VerseTag, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<VerseTag>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<VerseTag[]>;

  abstract findById(id: VerseTag['id']): Promise<NullableType<VerseTag>>;

  abstract update(
    id: VerseTag['id'],
    payload: DeepPartial<VerseTag>,
  ): Promise<VerseTag | null>;

  abstract remove(id: VerseTag['id']): Promise<void>;
}
