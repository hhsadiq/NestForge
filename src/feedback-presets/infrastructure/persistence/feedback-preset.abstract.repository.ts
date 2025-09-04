import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { FeedbackPreset } from '@src/feedback-presets/domain/feedback-preset';

export abstract class FeedbackPresetAbstractRepository {
  abstract create(
    data: Omit<FeedbackPreset, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<FeedbackPreset>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<FeedbackPreset[]>;

  abstract findById(
    id: FeedbackPreset['id'],
  ): Promise<NullableType<FeedbackPreset>>;

  abstract update(
    id: FeedbackPreset['id'],
    payload: DeepPartial<FeedbackPreset>,
  ): Promise<FeedbackPreset | null>;

  abstract remove(id: FeedbackPreset['id']): Promise<void>;
}
