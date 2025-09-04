import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { ParagraphTag } from '@src/paragraph-tags/domain/paragraph-tag';

export abstract class ParagraphTagAbstractRepository {
  abstract create(
    data: Omit<ParagraphTag, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ParagraphTag>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ParagraphTag[]>;

  abstract findById(
    id: ParagraphTag['id'],
  ): Promise<NullableType<ParagraphTag>>;

  abstract update(
    id: ParagraphTag['id'],
    payload: DeepPartial<ParagraphTag>,
  ): Promise<ParagraphTag | null>;

  abstract remove(id: ParagraphTag['id']): Promise<void>;
}
