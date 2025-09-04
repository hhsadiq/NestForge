import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { Review } from '@src/reviews/domain/review';

export abstract class ReviewAbstractRepository {
  abstract create(
    data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Review>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Review[]>;

  abstract findById(id: Review['id']): Promise<NullableType<Review>>;

  abstract update(
    id: Review['id'],
    payload: DeepPartial<Review>,
  ): Promise<Review | null>;

  abstract remove(id: Review['id']): Promise<void>;
}
