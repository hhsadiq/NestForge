import { Review } from '@src/reviews/domain/review';
import { ReviewEntity } from '@src/reviews/infrastructure/persistence/relational/entities/review.entity';

export class ReviewMapper {
  static toDomain(raw: ReviewEntity): Review {
    const domainEntity = new Review();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.translationId = raw.translation_id;

    domainEntity.reviewerId = raw.reviewer_id;

    domainEntity.workflowStatusId = raw.workflow_status_id;

    domainEntity.note = raw.note;

    domainEntity.closedAt = raw.closed_at;

    return domainEntity;
  }

  static toPersistence(domainEntity: Review): ReviewEntity {
    const persistenceEntity = new ReviewEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.translation_id = domainEntity.translationId;

    persistenceEntity.reviewer_id = domainEntity.reviewerId;

    persistenceEntity.workflow_status_id = domainEntity.workflowStatusId;

    persistenceEntity.note = domainEntity.note;

    persistenceEntity.closed_at = domainEntity.closedAt;

    return persistenceEntity;
  }
}
