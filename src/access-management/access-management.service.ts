import { Injectable } from '@nestjs/common';

import { CreatePermissionDto } from '@src/access-management/dtos/create-permission.dto';
import { CreateRoleDto } from '@src/access-management/dtos/create-role.dto';
import { ERROR_MESSAGES } from '@src/common/error-messages';
import { FORBIDDEN, NOT_FOUND } from '@src/common/exceptions';

import { AccessAbstractRepository } from './infrastructure/persistence/access.abstract.repository';

@Injectable()
export class AccessManagementService {
  constructor(private readonly repository: AccessAbstractRepository) {}

  async getUserPermissions(roleIds: number[]) {
    const permissions = await this.repository.findPermissionsByRoleIds(
      roleIds ?? [],
    );
    return permissions.map((p) => ({
      action: p.action as any,
      subject: (p as any)?.subject?.name ?? (p as any)?.subject,
    }));
  }

  async createRole(createRole: CreateRoleDto) {
    const existing = await this.repository.findRoleByName(createRole.name);
    if (existing) {
      throw FORBIDDEN(ERROR_MESSAGES.ALREADY_EXISTS('role'), 'role');
    }
    return this.repository.createRole(createRole);
  }

  async createPermission(createPermission: CreatePermissionDto) {
    const existing = await this.repository.findSubjectByName(
      createPermission.subject,
    );
    const subject =
      existing ??
      (await this.repository.createSubject(createPermission.subject));
    const existingPermission =
      await this.repository.findPermissionByActionAndSubject(
        createPermission.action as any,
        subject.id,
      );
    if (existingPermission) {
      throw FORBIDDEN(
        ERROR_MESSAGES.ALREADY_EXISTS('permission'),
        'permission',
      );
    }

    return this.repository.createPermission({
      action: createPermission.action as any,
      subject,
      description: createPermission.description,
    } as any);
  }

  getAllRoles() {
    return this.repository.findAllRoles();
  }

  getAllPermissions() {
    return this.repository.findAllPermissions();
  }

  assignRoleToUser(userId: number, roleId: number) {
    return this.assignRoleWithChecks(userId, roleId);
  }

  removeRoleFromUser(userId: number, roleId: number) {
    return this.removeRoleWithChecks(userId, roleId);
  }

  private async assignRoleWithChecks(userId: number, roleId: number) {
    const userExists = await this.repository.userExists(userId);
    if (!userExists) {
      throw NOT_FOUND('User', { id: userId });
    }

    const roleExists = await this.repository.roleExists(roleId);
    if (!roleExists) {
      throw NOT_FOUND('Role', { id: roleId });
    }

    const alreadyAssigned = await this.repository.isUserRoleAssigned(
      userId,
      roleId,
    );
    if (alreadyAssigned) {
      throw FORBIDDEN(ERROR_MESSAGES.ALREADY_EXISTS('user role'), 'userRole');
    }

    return this.repository.assignRoleToUser(userId, roleId);
  }

  assignPermissionToRole(roleId: number, permissionId: number) {
    return this.assignPermissionWithChecks(roleId, permissionId);
  }

  removePermissionFromRole(roleId: number, permissionId: number) {
    return this.removePermissionWithChecks(roleId, permissionId);
  }

  private async assignPermissionWithChecks(
    roleId: number,
    permissionId: number,
  ) {
    const roleExists = await this.repository.roleExists(roleId);
    if (!roleExists) {
      throw NOT_FOUND('Role', { id: roleId });
    }

    const permExists = await this.repository.permissionExists(permissionId);
    if (!permExists) {
      throw NOT_FOUND('Permission', { id: permissionId });
    }

    const alreadyAssigned = await this.repository.isPermissionAssignedToRole(
      roleId,
      permissionId,
    );
    if (alreadyAssigned) {
      throw FORBIDDEN(
        ERROR_MESSAGES.ALREADY_EXISTS('role permission'),
        'rolePermission',
      );
    }

    return this.repository.assignPermissionToRole(roleId, permissionId);
  }

  private async removeRoleWithChecks(userId: number, roleId: number) {
    const userExists = await this.repository.userExists(userId);
    if (!userExists) {
      throw NOT_FOUND('User', { id: userId });
    }

    const roleExists = await this.repository.roleExists(roleId);
    if (!roleExists) {
      throw NOT_FOUND('Role', { id: roleId });
    }

    const assigned = await this.repository.isUserRoleAssigned(userId, roleId);
    if (!assigned) {
      throw NOT_FOUND('UserRole', { userId, roleId } as any);
    }

    return this.repository.unassignRoleFromUser(userId, roleId);
  }

  private async removePermissionWithChecks(
    roleId: number,
    permissionId: number,
  ) {
    const roleExists = await this.repository.roleExists(roleId);
    if (!roleExists) {
      throw NOT_FOUND('Role', { id: roleId });
    }

    const permExists = await this.repository.permissionExists(permissionId);
    if (!permExists) {
      throw NOT_FOUND('Permission', { id: permissionId });
    }

    const assigned = await this.repository.isPermissionAssignedToRole(
      roleId,
      permissionId,
    );
    if (!assigned) {
      throw NOT_FOUND('RolePermission', { roleId, permissionId } as any);
    }

    return this.repository.unassignPermissionFromRole(roleId, permissionId);
  }

  async assignRoleByNameToUser(userId: number, roleName: string) {
    const role = await this.repository.findRoleByName(roleName);
    if (role?.id) {
      await this.repository.assignRoleToUser(userId, role.id);
    }
  }

  getUserRoles(userId: number) {
    return this.repository.findRolesByUserId(userId);
  }
}
