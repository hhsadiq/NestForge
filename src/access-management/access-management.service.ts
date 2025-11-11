import { Injectable } from '@nestjs/common';

import { CreatePermissionDto } from '@src/access-management/dtos/create-permission.dto';
import { CreateRoleDto } from '@src/access-management/dtos/create-role.dto';
import { ERROR_MESSAGES } from '@src/common/error-messages';
import { FORBIDDEN, NOT_FOUND } from '@src/common/exceptions';

import { AccessAbstractRepository } from './infrastructure/persistence/access.abstract.repository';
import { PermissionActionType } from './types/permission-actions.type';

@Injectable()
export class AccessManagementService {
  constructor(
    private readonly accessManagementRepository: AccessAbstractRepository,
  ) {}

  async getUserPermissions(roleIds: number[]) {
    const permissions =
      await this.accessManagementRepository.findPermissionsByRoleIds(
        roleIds ?? [],
      );
    return permissions.map((p) => ({
      action: (p.action?.name ?? p.action) as PermissionActionType,
      subject: p.subject?.name ?? p.subject,
    }));
  }

  async createRole(createRole: CreateRoleDto) {
    const existing = await this.accessManagementRepository.findRoleByName(
      createRole.name,
    );
    if (existing) {
      throw FORBIDDEN(ERROR_MESSAGES.ALREADY_EXISTS('role'), 'role');
    }
    return this.accessManagementRepository.createRole(createRole);
  }

  async createPermission(createPermission: CreatePermissionDto) {
    const existingSubject =
      await this.accessManagementRepository.findSubjectByName(
        createPermission.subject,
      );
    const subject =
      existingSubject ??
      (await this.accessManagementRepository.createSubject(
        createPermission.subject,
      ));

    const actionName = createPermission.action;
    const action =
      await this.accessManagementRepository.findActionByName(actionName);
    if (!action) {
      throw NOT_FOUND('Action', { action: actionName });
    }

    const existingPermission =
      await this.accessManagementRepository.findPermissionByActionAndSubject(
        action.id,
        subject.id,
      );
    if (existingPermission) {
      throw FORBIDDEN(
        ERROR_MESSAGES.ALREADY_EXISTS('permission'),
        'permission',
      );
    }

    return this.accessManagementRepository.createPermission({
      action,
      subject,
    });
  }

  getAllRoles() {
    return this.accessManagementRepository.findAllRoles();
  }

  getAllPermissions() {
    return this.accessManagementRepository.findAllPermissions();
  }

  assignRoleToUser(userId: number, roleId: number) {
    return this.assignRoleWithChecks(userId, roleId);
  }

  removeRoleFromUser(userId: number, roleId: number) {
    return this.removeRoleWithChecks(userId, roleId);
  }

  private async assignRoleWithChecks(userId: number, roleId: number) {
    const userExists = await this.accessManagementRepository.userExists(userId);
    if (!userExists) {
      throw NOT_FOUND('User', { id: userId });
    }

    const roleExists = await this.accessManagementRepository.roleExists(roleId);
    if (!roleExists) {
      throw NOT_FOUND('Role', { id: roleId });
    }

    const alreadyAssigned =
      await this.accessManagementRepository.isUserRoleAssigned(userId, roleId);
    if (alreadyAssigned) {
      throw FORBIDDEN(ERROR_MESSAGES.ALREADY_EXISTS('user role'), 'userRole');
    }

    return this.accessManagementRepository.assignRoleToUser(userId, roleId);
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
    const roleExists = await this.accessManagementRepository.roleExists(roleId);
    if (!roleExists) {
      throw NOT_FOUND('Role', { id: roleId });
    }

    const permExists =
      await this.accessManagementRepository.permissionExists(permissionId);
    if (!permExists) {
      throw NOT_FOUND('Permission', { id: permissionId });
    }

    const alreadyAssigned =
      await this.accessManagementRepository.isPermissionAssignedToRole(
        roleId,
        permissionId,
      );
    if (alreadyAssigned) {
      throw FORBIDDEN(
        ERROR_MESSAGES.ALREADY_EXISTS('role permission'),
        'rolePermission',
      );
    }

    return this.accessManagementRepository.assignPermissionToRole(
      roleId,
      permissionId,
    );
  }

  private async removeRoleWithChecks(userId: number, roleId: number) {
    const userExists = await this.accessManagementRepository.userExists(userId);
    if (!userExists) {
      throw NOT_FOUND('User', { id: userId });
    }

    const roleExists = await this.accessManagementRepository.roleExists(roleId);
    if (!roleExists) {
      throw NOT_FOUND('Role', { id: roleId });
    }

    const assigned = await this.accessManagementRepository.isUserRoleAssigned(
      userId,
      roleId,
    );
    if (!assigned) {
      throw NOT_FOUND('UserRole', { userId, roleId } as any);
    }

    return this.accessManagementRepository.unassignRoleFromUser(userId, roleId);
  }

  private async removePermissionWithChecks(
    roleId: number,
    permissionId: number,
  ) {
    const roleExists = await this.accessManagementRepository.roleExists(roleId);
    if (!roleExists) {
      throw NOT_FOUND('Role', { id: roleId });
    }

    const permExists =
      await this.accessManagementRepository.permissionExists(permissionId);
    if (!permExists) {
      throw NOT_FOUND('Permission', { id: permissionId });
    }

    const assigned =
      await this.accessManagementRepository.isPermissionAssignedToRole(
        roleId,
        permissionId,
      );
    if (!assigned) {
      throw NOT_FOUND('RolePermission', { roleId, permissionId } as any);
    }

    return this.accessManagementRepository.unassignPermissionFromRole(
      roleId,
      permissionId,
    );
  }

  async assignRoleByNameToUser(userId: number, roleName: string) {
    const role = await this.accessManagementRepository.findRoleByName(roleName);
    if (role?.id) {
      await this.accessManagementRepository.assignRoleToUser(userId, role.id);
    }
  }

  getUserRoles(userId: number) {
    return this.accessManagementRepository.findRolesByUserId(userId);
  }
}
