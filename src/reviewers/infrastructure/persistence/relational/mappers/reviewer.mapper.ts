import { Reviewer } from '@src/reviewers/domain/reviewer';
import { ReviewerEntity } from '@src/reviewers/infrastructure/persistence/relational/entities/reviewer.entity';

export class ReviewerMapper {
  static toDomain(raw: ReviewerEntity): Reviewer {
    const domainEntity = new Reviewer();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.displayName = raw.display_name;

    domainEntity.email = raw.email;

    domainEntity.translatorId = raw.translator_id;

    domainEntity.note = raw.note;

    return domainEntity;
  }

  static toPersistence(domainEntity: Reviewer): ReviewerEntity {
    const persistenceEntity = new ReviewerEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.display_name = domainEntity.displayName;

    persistenceEntity.email = domainEntity.email;

    persistenceEntity.translator_id = domainEntity.translatorId;

    persistenceEntity.note = domainEntity.note;

    return persistenceEntity;
  }
}
