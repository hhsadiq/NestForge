import { Permission } from '@src/access-management/domain/permission';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';

import { SubjectMapper } from './subject.mapper';

export class PermissionMapper {
  static toDomain(raw: PermissionEntity): Permission {
    const domainEntity = new Permission();
    domainEntity.id = raw.id;
    domainEntity.action = raw.action;
    if (raw.subject) {
      domainEntity.subject = SubjectMapper.toDomain(raw.subject);
    }
    if (raw.description !== undefined) {
      domainEntity.description = raw.description ?? undefined;
    }
    return domainEntity;
  }

  static toPersistence(domainEntity: Permission): PermissionEntity {
    const persistenceEntity = new PermissionEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.action = domainEntity.action;
    if (domainEntity.subject) {
      persistenceEntity.subject = SubjectMapper.toPersistence(
        domainEntity.subject,
      );
    }
    if (domainEntity.description !== undefined) {
      persistenceEntity.description = domainEntity.description ?? null;
    }
    return persistenceEntity;
  }
}
