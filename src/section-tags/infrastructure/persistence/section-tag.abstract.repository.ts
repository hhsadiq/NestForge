import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { SectionTag } from '@src/section-tags/domain/section-tag';

export abstract class SectionTagAbstractRepository {
  abstract create(
    data: Omit<SectionTag, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<SectionTag>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SectionTag[]>;

  abstract findById(id: SectionTag['id']): Promise<NullableType<SectionTag>>;

  abstract update(
    id: SectionTag['id'],
    payload: DeepPartial<SectionTag>,
  ): Promise<SectionTag | null>;

  abstract remove(id: SectionTag['id']): Promise<void>;
}
