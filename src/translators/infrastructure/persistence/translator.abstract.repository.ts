import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Translator } from '@src/translators/domain/translator';

export abstract class TranslatorAbstractRepository {
  abstract create(
    data: Omit<Translator, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Translator>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Translator[]>;

  abstract findById(id: Translator['id']): Promise<NullableType<Translator>>;

  abstract update(
    id: Translator['id'],
    payload: DeepPartial<Translator>,
  ): Promise<Translator | null>;

  abstract remove(id: Translator['id']): Promise<void>;
}
