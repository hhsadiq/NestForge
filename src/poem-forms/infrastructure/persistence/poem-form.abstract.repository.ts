import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { PoemForm } from '@src/poem-forms/domain/poem-form';

export abstract class PoemFormAbstractRepository {
  abstract create(
    data: Omit<PoemForm, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<PoemForm>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<PoemForm[]>;

  abstract findById(id: PoemForm['id']): Promise<NullableType<PoemForm>>;

  abstract update(
    id: PoemForm['id'],
    payload: DeepPartial<PoemForm>,
  ): Promise<PoemForm | null>;

  abstract remove(id: PoemForm['id']): Promise<void>;
}
