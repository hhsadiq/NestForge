import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PermissionActionEnum } from '@src/access-management/enums/permission-actions.enum';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { RolePermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role-permission.entity';
import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';

@Injectable()
export class RolePermissionSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermissionRepo: Repository<RolePermissionEntity>,
  ) {}

  async run() {
    // Load roles
    const [adminRole, userRole] = await Promise.all([
      this.roleRepo.findOne({ where: { name: 'Admin' } }),
      this.roleRepo.findOne({ where: { name: 'User' } }),
    ]);

    if (!adminRole && !userRole) return;

    // Load permissions for subject 'User'
    const perms = await this.permissionRepo.find({
      where: {
        action: In([
          PermissionActionEnum.CREATE,
          PermissionActionEnum.READ,
          PermissionActionEnum.UPDATE,
          PermissionActionEnum.DELETE,
        ]),
      },
      relations: ['subject'],
    });
    const userPerms = perms.filter((p) => p.subject?.name === 'User');
    const accessManagementPerms = perms.filter(
      (p) => p.subject?.name === 'AccessManagement',
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
      const readPerm = userPerms.find(
        (p) => p.action === PermissionActionEnum.READ,
      );
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
