import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { PoemMedia } from '@src/poem-media/domain/poem-media';

export abstract class PoemMediaAbstractRepository {
  abstract create(
    data: Omit<PoemMedia, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PoemMedia>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PoemMedia[]>;

  abstract findById(id: PoemMedia['id']): Promise<NullableType<PoemMedia>>;

  abstract update(
    id: PoemMedia['id'],
    payload: DeepPartial<PoemMedia>,
  ): Promise<PoemMedia | null>;

  abstract remove(id: PoemMedia['id']): Promise<void>;
}
