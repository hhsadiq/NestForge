import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Section } from '@src/sections/domain/section';

export abstract class SectionAbstractRepository {
  abstract create(
    data: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Section>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Section[]>;

  abstract findById(id: Section['id']): Promise<NullableType<Section>>;

  abstract update(
    id: Section['id'],
    payload: DeepPartial<Section>,
  ): Promise<Section | null>;

  abstract remove(id: Section['id']): Promise<void>;
}
