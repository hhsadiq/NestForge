import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Reviewer } from '@src/reviewers/domain/reviewer';

export abstract class ReviewerAbstractRepository {
  abstract create(
    data: Omit<Reviewer, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Reviewer>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Reviewer[]>;

  abstract findById(id: Reviewer['id']): Promise<NullableType<Reviewer>>;

  abstract update(
    id: Reviewer['id'],
    payload: DeepPartial<Reviewer>,
  ): Promise<Reviewer | null>;

  abstract remove(id: Reviewer['id']): Promise<void>;
}
