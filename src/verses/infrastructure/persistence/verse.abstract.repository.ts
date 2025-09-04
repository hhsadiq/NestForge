import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Verse } from '@src/verses/domain/verse';

export abstract class VerseAbstractRepository {
  abstract create(
    data: Omit<Verse, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Verse>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Verse[]>;

  abstract findById(id: Verse['id']): Promise<NullableType<Verse>>;

  abstract update(
    id: Verse['id'],
    payload: DeepPartial<Verse>,
  ): Promise<Verse | null>;

  abstract remove(id: Verse['id']): Promise<void>;
}
