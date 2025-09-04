import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Meter } from '@src/meters/domain/meter';

export abstract class MeterAbstractRepository {
  abstract create(
    data: Omit<Meter, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Meter>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Meter[]>;

  abstract findById(id: Meter['id']): Promise<NullableType<Meter>>;

  abstract update(
    id: Meter['id'],
    payload: DeepPartial<Meter>,
  ): Promise<Meter | null>;

  abstract remove(id: Meter['id']): Promise<void>;
}
