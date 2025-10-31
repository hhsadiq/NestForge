import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PermissionActionEnum } from '@src/access-management/enums/permission-actions.enum';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';

@Injectable()
export class RolePermissionSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
  ) {}

  async run() {
    // Load roles
    const [adminRole, userRole] = await Promise.all([
      this.roleRepo.findOne({
        where: { name: 'Admin' },
        relations: ['permissions'],
      }),
      this.roleRepo.findOne({
        where: { name: 'User' },
        relations: ['permissions'],
      }),
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
      const missingUserPerms = userPerms.filter(
        (p) => !adminRole.permissions?.some((ap) => ap.id === p.id),
      );
      for (const p of missingUserPerms) {
        await this.roleRepo
          .createQueryBuilder()
          .relation(RoleEntity, 'permissions')
          .of(adminRole.id)
          .add(p.id);
      }

      const missingAccessPerms = accessManagementPerms.filter(
        (p) => !adminRole.permissions?.some((ap) => ap.id === p.id),
      );
      for (const p of missingAccessPerms) {
        await this.roleRepo
          .createQueryBuilder()
          .relation(RoleEntity, 'permissions')
          .of(adminRole.id)
          .add(p.id);
      }
    }

    if (userRole) {
      const readPerm = userPerms.find(
        (p) => p.action === PermissionActionEnum.READ,
      );
      if (
        readPerm &&
        !userRole.permissions?.some((up) => up.id === readPerm.id)
      ) {
        await this.roleRepo
          .createQueryBuilder()
          .relation(RoleEntity, 'permissions')
          .of(userRole.id)
          .add(readPerm.id);
      }
    }
  }
}
