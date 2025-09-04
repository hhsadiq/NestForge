import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Paragraph } from '@src/paragraphs/domain/paragraph';

export abstract class ParagraphAbstractRepository {
  abstract create(
    data: Omit<Paragraph, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Paragraph>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Paragraph[]>;

  abstract findById(id: Paragraph['id']): Promise<NullableType<Paragraph>>;

  abstract update(
    id: Paragraph['id'],
    payload: DeepPartial<Paragraph>,
  ): Promise<Paragraph | null>;

  abstract remove(id: Paragraph['id']): Promise<void>;
}
