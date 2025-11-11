import { Permission } from '@src/access-management/domain/permission';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';

import { ActionMapper } from './action.mapper';
import { SubjectMapper } from './subject.mapper';

export class PermissionMapper {
  static toDomain(raw: PermissionEntity): Permission {
    const domainEntity = new Permission();
    domainEntity.id = raw.id;
    if (raw.action) {
      domainEntity.action = ActionMapper.toDomain(raw.action);
    }
    if (raw.subject) {
      domainEntity.subject = SubjectMapper.toDomain(raw.subject);
    }
    if (raw.created_at) {
      domainEntity.createdAt = raw.created_at;
    }
    if (raw.updated_at) {
      domainEntity.updatedAt = raw.updated_at;
    }
    return domainEntity;
  }

  static toPersistence(domainEntity: Permission): PermissionEntity {
    const persistenceEntity = new PermissionEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    if (domainEntity.action) {
      persistenceEntity.action = ActionMapper.toPersistence(
        domainEntity.action,
      );
      persistenceEntity.action_id = domainEntity.action.id;
    }
    if (domainEntity.subject) {
      persistenceEntity.subject = SubjectMapper.toPersistence(
        domainEntity.subject,
      );
      persistenceEntity.subject_id = domainEntity.subject.id;
    }
    return persistenceEntity;
  }
}
