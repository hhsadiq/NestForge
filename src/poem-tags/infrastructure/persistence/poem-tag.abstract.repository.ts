import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { PoemTag } from '@src/poem-tags/domain/poem-tag';

export abstract class PoemTagAbstractRepository {
  abstract create(
    data: Omit<PoemTag, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PoemTag>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PoemTag[]>;

  abstract findById(id: PoemTag['id']): Promise<NullableType<PoemTag>>;

  abstract update(
    id: PoemTag['id'],
    payload: DeepPartial<PoemTag>,
  ): Promise<PoemTag | null>;

  abstract remove(id: PoemTag['id']): Promise<void>;
}
