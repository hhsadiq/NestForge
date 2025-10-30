import { Role } from '@src/access-management/domain/role';
import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';

import { PermissionMapper } from './permission.mapper';

export class RoleMapper {
  static toDomain(raw: RoleEntity): Role {
    const domainEntity = new Role();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    if (raw.description !== undefined) {
      domainEntity.description = raw.description ?? undefined;
    }
    if (raw?.permissions?.length) {
      // map only when loaded
      (domainEntity as any).permissions = raw.permissions.map((p) =>
        PermissionMapper.toDomain(p),
      );
    }
    return domainEntity;
  }

  static toPersistence(domainEntity: Role): RoleEntity {
    const persistenceEntity = new RoleEntity();

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }

    persistenceEntity.name = domainEntity.name;
    if (domainEntity.description !== undefined) {
      persistenceEntity.description = domainEntity.description ?? null;
    }
    if ((domainEntity as any)?.permissions?.length) {
      // optional mapping if permissions present
      persistenceEntity.permissions = (domainEntity as any).permissions.map(
        (p) => PermissionMapper.toPersistence(p),
      );
    }
    return persistenceEntity;
  }
}
