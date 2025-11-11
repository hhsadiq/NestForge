import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ActionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/action.entity';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { RolePermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role-permission.entity';
import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';

@Injectable()
export class RolePermissionSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepo: Repository<RolePermissionEntity>,
    @InjectRepository(ActionEntity)
    private readonly actionRepo: Repository<ActionEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepo: Repository<SubjectEntity>,
  ) {}

  async run() {
    // Load roles
    const [adminRole, userRole] = await Promise.all([
      this.roleRepo.findOne({ where: { name: 'Admin' } }),
      this.roleRepo.findOne({ where: { name: 'User' } }),
    ]);

    if (!adminRole && !userRole) return;

    // Load actions
    const actionNames = ['create', 'read', 'update', 'delete'];
    const actions = await this.actionRepo.find({
      where: actionNames.map((name) => ({ name })),
    });
    const actionIds = actions.map((a) => a.id);

    // Load subjects
    const [userSubject, accessManagementSubject] = await Promise.all([
      this.subjectRepo.findOne({ where: { name: 'User' } }),
      this.subjectRepo.findOne({ where: { name: 'AccessManagement' } }),
    ]);

    // Load permissions
    const perms = await this.permissionRepo.find({
      where: {
        action_id: In(actionIds),
      },
      relations: ['subject', 'action'],
    });
    const userPerms = perms.filter(
      (p) => p.subject?.name === 'User' && userSubject,
    );
    const accessManagementPerms = perms.filter(
      (p) => p.subject?.name === 'AccessManagement' && accessManagementSubject,
    );

    // Assign: Admin gets all CRUD, User gets read only
    if (adminRole) {
      const existingAdminRolePerms = await this.rolePermissionRepo.find({
        where: { role_id: adminRole.id },
      });
      const existingAdminPermIds = new Set(
        existingAdminRolePerms.map((rp) => rp.permission_id),
      );

      const missingUserPerms = userPerms.filter(
        (p) => !existingAdminPermIds.has(p.id),
      );
      for (const p of missingUserPerms) {
        await this.rolePermissionRepo.save(
          this.rolePermissionRepo.create({
            role_id: adminRole.id,
            permission_id: p.id,
          }),
        );
      }

      const missingAccessPerms = accessManagementPerms.filter(
        (p) => !existingAdminPermIds.has(p.id),
      );
      for (const p of missingAccessPerms) {
        await this.rolePermissionRepo.save(
          this.rolePermissionRepo.create({
            role_id: adminRole.id,
            permission_id: p.id,
          }),
        );
      }
    }

    if (userRole) {
      const readAction = actions.find((a) => a.name === 'read');
      const readPerm = userPerms.find((p) => p.action?.id === readAction?.id);
      if (readPerm) {
        const exists = await this.rolePermissionRepo.findOne({
          where: { role_id: userRole.id, permission_id: readPerm.id },
        });
        if (!exists) {
          await this.rolePermissionRepo.save(
            this.rolePermissionRepo.create({
              role_id: userRole.id,
              permission_id: readPerm.id,
            }),
          );
        }
      }
    }
  }
}
