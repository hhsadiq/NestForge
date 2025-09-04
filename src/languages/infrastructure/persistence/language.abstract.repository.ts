import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Language } from '@src/languages/domain/language';

export abstract class LanguageAbstractRepository {
  abstract create(
    data: Omit<Language, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Language>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Language[]>;

  abstract findById(id: Language['id']): Promise<NullableType<Language>>;

  abstract update(
    id: Language['id'],
    payload: DeepPartial<Language>,
  ): Promise<Language | null>;

  abstract remove(id: Language['id']): Promise<void>;
}
