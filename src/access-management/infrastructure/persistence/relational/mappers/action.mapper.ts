import { Action } from '@src/access-management/domain/action';
import { ActionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/action.entity';

export class ActionMapper {
  static toDomain(raw: ActionEntity): Action {
    const domainEntity = new Action();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    if (raw.description !== undefined) {
      domainEntity.description = raw.description ?? undefined;
    }
    if (raw.created_at) {
      domainEntity.createdAt = raw.created_at;
    }
    if (raw.updated_at) {
      domainEntity.updatedAt = raw.updated_at;
    }
    return domainEntity;
  }

  static toPersistence(domainEntity: Action): ActionEntity {
    const persistenceEntity = new ActionEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.name = domainEntity.name;
    if (domainEntity.description !== undefined) {
      persistenceEntity.description = domainEntity.description ?? null;
    }
    return persistenceEntity;
  }
}
