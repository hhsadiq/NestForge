import { WorkflowStatus } from '@src/workflow-statuses/domain/workflow-status';
import { WorkflowStatusEntity } from '@src/workflow-statuses/infrastructure/persistence/relational/entities/workflow-status.entity';

export class WorkflowStatusMapper {
  static toDomain(raw: WorkflowStatusEntity): WorkflowStatus {
    const domainEntity = new WorkflowStatus();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.created_at;
    domainEntity.updatedAt = raw.updated_at;

    domainEntity.code = raw.code;

    domainEntity.name = raw.name;

    domainEntity.description = raw.description;

    return domainEntity;
  }

  static toPersistence(domainEntity: WorkflowStatus): WorkflowStatusEntity {
    const persistenceEntity = new WorkflowStatusEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.created_at = domainEntity.createdAt;
    persistenceEntity.updated_at = domainEntity.updatedAt;

    persistenceEntity.code = domainEntity.code;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.description = domainEntity.description;

    return persistenceEntity;
  }
}
