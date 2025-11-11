import { RolePermission } from '@src/access-management/domain/role-permission';
import { RolePermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role-permission.entity';

import { PermissionMapper } from './permission.mapper';
import { RoleMapper } from './role.mapper';

export class RolePermissionMapper {
  static toDomain(raw: RolePermissionEntity): RolePermission {
    const domainEntity = new RolePermission();
    if ((raw as any).id) {
      (domainEntity as any).id = (raw as any).id;
    }

    if (raw.role) {
      domainEntity.role = RoleMapper.toDomain(raw.role);
    }
    if (raw.permission) {
      domainEntity.permission = PermissionMapper.toDomain(raw.permission);
    }
    if (raw.created_at) {
      domainEntity.createdAt = raw.created_at;
    }
    if (raw.updated_at) {
      domainEntity.updatedAt = raw.updated_at;
    }
    return domainEntity;
  }

  static toPersistence(domainEntity: RolePermission): RolePermissionEntity {
    const persistenceEntity = new RolePermissionEntity();

    if ((domainEntity as any)?.id) {
      (persistenceEntity as any).id = (domainEntity as any).id;
    }

    if (domainEntity.role) {
      persistenceEntity.role = RoleMapper.toPersistence(domainEntity.role);
      persistenceEntity.role_id = domainEntity.role.id;
    }
    if (domainEntity.permission) {
      persistenceEntity.permission = PermissionMapper.toPersistence(
        domainEntity.permission,
      );
      persistenceEntity.permission_id = domainEntity.permission.id;
    }
    return persistenceEntity;
  }
}
