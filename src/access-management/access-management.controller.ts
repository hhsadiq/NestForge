import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CheckAbility } from '@src/access-management/casl/check-ability.decorator';
import { PoliciesGuard } from '@src/access-management/casl/policies.guard';
import { CreatePermissionDto } from '@src/access-management/dtos/create-permission.dto';
import { CreateRoleDto } from '@src/access-management/dtos/create-role.dto';
import { PermissionActionEnum } from '@src/access-management/enums/permission-actions.enum';

import { AccessManagementService } from './access-management.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Access Management')
@Controller({ path: 'access-management', version: '1' })
export class AccessManagementController {
  constructor(private readonly service: AccessManagementService) {}

  @Post('roles')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({
    action: PermissionActionEnum.CREATE,
    subject: 'AccessManagement',
  })
  createRole(@Body() body: CreateRoleDto) {
    return this.service.createRole(body);
  }

  @Post('permissions')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({
    action: PermissionActionEnum.CREATE,
    subject: 'AccessManagement',
  })
  createPermission(@Body() body: CreatePermissionDto) {
    return this.service.createPermission(body);
  }

  @Get('roles')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({
    action: PermissionActionEnum.READ,
    subject: 'AccessManagement',
  })
  getRoles() {
    return this.service.getAllRoles();
  }

  @Get('permissions')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({
    action: PermissionActionEnum.READ,
    subject: 'AccessManagement',
  })
  getPermissions() {
    return this.service.getAllPermissions();
  }

  @Patch('assign-role/:userId/:roleId')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({
    action: PermissionActionEnum.UPDATE,
    subject: 'AccessManagement',
  })
  assignRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.service.assignRoleToUser(userId, roleId);
  }

  @Patch('remove-role/:userId/:roleId')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({
    action: PermissionActionEnum.UPDATE,
    subject: 'AccessManagement',
  })
  removeRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.service.removeRoleFromUser(userId, roleId);
  }

  @Patch('assign-permission/:roleId/:permissionId')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({
    action: PermissionActionEnum.UPDATE,
    subject: 'AccessManagement',
  })
  assignPermission(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return this.service.assignPermissionToRole(roleId, permissionId);
  }

  @Patch('remove-permission/:roleId/:permissionId')
  @UseGuards(AuthGuard('jwt'), PoliciesGuard)
  @CheckAbility({
    action: PermissionActionEnum.UPDATE,
    subject: 'AccessManagement',
  })
  removePermission(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
  ) {
    return this.service.removePermissionFromRole(roleId, permissionId);
  }
}
