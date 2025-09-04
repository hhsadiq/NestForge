import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Tag } from '@src/tags/domain/tag';

export abstract class TagAbstractRepository {
  abstract create(
    data: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Tag>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Tag[]>;

  abstract findById(id: Tag['id']): Promise<NullableType<Tag>>;

  abstract update(
    id: Tag['id'],
    payload: DeepPartial<Tag>,
  ): Promise<Tag | null>;

  abstract remove(id: Tag['id']): Promise<void>;
}
