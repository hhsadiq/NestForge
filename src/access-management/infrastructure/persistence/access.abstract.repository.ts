import { Action } from '@src/access-management/domain/action';
import { Permission } from '@src/access-management/domain/permission';
import { Role } from '@src/access-management/domain/role';
import { Subject } from '@src/access-management/domain/subject';

export abstract class AccessAbstractRepository {
  abstract findRolesByUserId(userId: number): Promise<Role[]>;
  abstract findPermissionsByRoleIds(roleIds: number[]): Promise<Permission[]>;
  abstract findRoleByName(name: string): Promise<Role | null>;
  abstract findSubjectByName(name: string): Promise<Subject | null>;
  abstract createSubject(name: string): Promise<Subject>;
  abstract findActionByName(name: string): Promise<Action | null>;
  abstract findAllRoles(): Promise<Role[]>;
  abstract findAllPermissions(): Promise<Permission[]>;
  abstract findPermissionByActionAndSubject(
    actionId: number,
    subjectId: number,
  ): Promise<Permission | null>;

  abstract userExists(userId: number): Promise<boolean>;
  abstract roleExists(roleId: number): Promise<boolean>;
  abstract isUserRoleAssigned(userId: number, roleId: number): Promise<boolean>;
  abstract permissionExists(permissionId: number): Promise<boolean>;
  abstract isPermissionAssignedToRole(
    roleId: number,
    permissionId: number,
  ): Promise<boolean>;

  abstract createRole(
    createRole: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Role>;
  abstract createPermission(
    createPermission: Omit<Permission, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Permission>;
  abstract assignRoleToUser(userId: number, roleId: number): Promise<void>;
  abstract unassignRoleFromUser(userId: number, roleId: number): Promise<void>;
  abstract assignPermissionToRole(
    roleId: number,
    permissionId: number,
  ): Promise<void>;
  abstract unassignPermissionFromRole(
    roleId: number,
    permissionId: number,
  ): Promise<void>;
}
