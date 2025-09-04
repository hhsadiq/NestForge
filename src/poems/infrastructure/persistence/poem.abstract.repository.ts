import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Poem } from '@src/poems/domain/poem';

export abstract class PoemAbstractRepository {
  abstract create(
    data: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Poem>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Poem[]>;

  abstract findById(id: Poem['id']): Promise<NullableType<Poem>>;

  abstract update(
    id: Poem['id'],
    payload: DeepPartial<Poem>,
  ): Promise<Poem | null>;

  abstract remove(id: Poem['id']): Promise<void>;
}
