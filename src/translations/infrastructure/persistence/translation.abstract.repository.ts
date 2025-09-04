import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Translation } from '@src/translations/domain/translation';

export abstract class TranslationAbstractRepository {
  abstract create(
    data: Omit<Translation, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Translation>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Translation[]>;

  abstract findById(id: Translation['id']): Promise<NullableType<Translation>>;

  abstract update(
    id: Translation['id'],
    payload: DeepPartial<Translation>,
  ): Promise<Translation | null>;

  abstract remove(id: Translation['id']): Promise<void>;
}
