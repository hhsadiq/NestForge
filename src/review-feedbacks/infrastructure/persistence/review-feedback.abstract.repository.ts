import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { ReviewFeedback } from '@src/review-feedbacks/domain/review-feedback';

export abstract class ReviewFeedbackAbstractRepository {
  abstract create(
    data: Omit<ReviewFeedback, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ReviewFeedback>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<ReviewFeedback[]>;

  abstract findById(
    id: ReviewFeedback['id'],
  ): Promise<NullableType<ReviewFeedback>>;

  abstract update(
    id: ReviewFeedback['id'],
    payload: DeepPartial<ReviewFeedback>,
  ): Promise<ReviewFeedback | null>;

  abstract remove(id: ReviewFeedback['id']): Promise<void>;
}
