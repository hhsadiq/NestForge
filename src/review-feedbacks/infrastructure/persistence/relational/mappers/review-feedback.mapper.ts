import { ReviewFeedback } from '@src/review-feedbacks/domain/review-feedback';
import { ReviewFeedbackEntity } from '@src/review-feedbacks/infrastructure/persistence/relational/entities/review-feedback.entity';

export class ReviewFeedbackMapper {
  static toDomain(raw: ReviewFeedbackEntity): ReviewFeedback {
    const domainEntity = new ReviewFeedback();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.reviewId = raw.review_id;

    domainEntity.feedbackPresetId = raw.feedback_preset_id;

    domainEntity.note = raw.note;

    return domainEntity;
  }

  static toPersistence(domainEntity: ReviewFeedback): ReviewFeedbackEntity {
    const persistenceEntity = new ReviewFeedbackEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.review_id = domainEntity.reviewId;

    persistenceEntity.feedback_preset_id = domainEntity.feedbackPresetId;

    persistenceEntity.note = domainEntity.note;

    return persistenceEntity;
  }
}
