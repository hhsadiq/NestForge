import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Stanza } from '@src/stanzas/domain/stanza';

export abstract class StanzaAbstractRepository {
  abstract create(
    data: Omit<Stanza, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Stanza>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Stanza[]>;

  abstract findById(id: Stanza['id']): Promise<NullableType<Stanza>>;

  abstract update(
    id: Stanza['id'],
    payload: DeepPartial<Stanza>,
  ): Promise<Stanza | null>;

  abstract remove(id: Stanza['id']): Promise<void>;
}
