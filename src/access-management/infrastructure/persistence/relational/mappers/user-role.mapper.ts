import { UserRole } from '@src/access-management/domain/user-role';
import { UserRoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/user-role.entity';
import { RoleMapper } from '@src/access-management/infrastructure/persistence/relational/mappers/role.mapper';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';

export class UserRoleMapper {
  static toDomain(raw: UserRoleEntity): UserRole {
    const domainEntity = new UserRole();
    if ((raw as any).id) {
      (domainEntity as any).id = (raw as any).id;
    }
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }
    if (raw.role) {
      domainEntity.role = RoleMapper.toDomain(raw.role);
    }
    if (raw.created_at) {
      domainEntity.createdAt = raw.created_at;
    }
    if (raw.updated_at) {
      domainEntity.updatedAt = raw.updated_at;
    }
    return domainEntity;
  }

  static toPersistence(domainEntity: UserRole): UserRoleEntity {
    const persistenceEntity = new UserRoleEntity();

    if ((domainEntity as any).id) {
      (persistenceEntity as any).id = (domainEntity as any).id;
    }

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
      persistenceEntity.user_id = domainEntity.user.id as number;
    }
    if (domainEntity.role) {
      persistenceEntity.role = RoleMapper.toPersistence(domainEntity.role);
      persistenceEntity.role_id = domainEntity.role.id as number;
    }
    return persistenceEntity;
  }
}
