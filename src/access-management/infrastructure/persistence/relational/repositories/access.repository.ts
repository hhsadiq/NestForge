import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Permission } from '@src/access-management/domain/permission';
import { Role } from '@src/access-management/domain/role';
import { Subject } from '@src/access-management/domain/subject';
import { AccessAbstractRepository } from '@src/access-management/infrastructure/persistence/access.abstract.repository';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';
import { PermissionMapper } from '@src/access-management/infrastructure/persistence/relational/mappers/permission.mapper';
import { RoleMapper } from '@src/access-management/infrastructure/persistence/relational/mappers/role.mapper';
import { SubjectMapper } from '@src/access-management/infrastructure/persistence/relational/mappers/subject.mapper';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class AccessRelationalRepository extends AccessAbstractRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepo: Repository<PermissionEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepo: Repository<SubjectEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {
    super();
  }

  async findRolesByUserId(userId: number): Promise<Role[]> {
    // Support M2M via user_role join table
    const roles = await this.roleRepo
      .createQueryBuilder('role')
      .innerJoin(
        'user_role',
        'ur',
        'ur.role_id = role.id AND ur.user_id = :userId',
        {
          userId,
        },
      )
      .leftJoinAndSelect('role.permissions', 'permission')
      .getMany();
    return roles.map(RoleMapper.toDomain);
  }

  async findPermissionsByRoleIds(roleIds: number[]): Promise<Permission[]> {
    const roles = await this.roleRepo.find({
      where: { id: In(roleIds) },
      relations: ['permissions'],
    });
    const permissions = roles.flatMap((r) => r.permissions || []);
    // Deduplicate by id
    const unique = new Map<number, PermissionEntity>();
    for (const p of permissions) unique.set(p.id, p);
    return Array.from(unique.values()).map(PermissionMapper.toDomain);
  }

  async findRoleByName(name: string): Promise<Role | null> {
    const r = await this.roleRepo.findOne({ where: { name } });
    return r ? RoleMapper.toDomain({ ...r, permissions: [] }) : null;
  }

  async findSubjectByName(name: string): Promise<Subject | null> {
    const entity = await this.subjectRepo.findOne({ where: { name } });
    return entity ? SubjectMapper.toDomain(entity) : null;
  }

  async createSubject(name: string): Promise<Subject> {
    const saved = await this.subjectRepo.save(
      this.subjectRepo.create({ name }),
    );
    return SubjectMapper.toDomain(saved);
  }

  async findAllRoles(): Promise<Role[]> {
    const roles = await this.roleRepo.find();
    return roles.map((r) => RoleMapper.toDomain({ ...r, permissions: [] }));
  }

  async findAllPermissions(): Promise<Permission[]> {
    const perms = await this.permissionRepo.find({ relations: ['subject'] });
    return perms.map(PermissionMapper.toDomain);
  }

  async findPermissionByActionAndSubject(
    action: string,
    subjectId: number,
  ): Promise<Permission | null> {
    const existing = await this.permissionRepo.findOne({
      where: { action: action as any, subject: { id: subjectId } as any },
      relations: ['subject'],
    });
    return existing ? PermissionMapper.toDomain(existing) : null;
  }

  async createRole(createRole: Role): Promise<Role> {
    const entity = RoleMapper.toPersistence(createRole);
    const saved = await this.roleRepo.save(this.roleRepo.create(entity));
    return RoleMapper.toDomain({ ...saved, permissions: [] });
  }

  async createPermission(
    createPermission: Omit<Permission, 'id'>,
  ): Promise<Permission> {
    const entity = PermissionMapper.toPersistence(
      createPermission as Permission,
    );
    const saved = await this.permissionRepo.save(
      this.permissionRepo.create(entity),
    );
    return PermissionMapper.toDomain(saved);
  }

  async userExists(userId: number): Promise<boolean> {
    const count = await this.userRepo.count({ where: { id: userId } });
    return count > 0;
  }

  async roleExists(roleId: number): Promise<boolean> {
    const count = await this.roleRepo.count({ where: { id: roleId } });
    return count > 0;
  }

  async isUserRoleAssigned(userId: number, roleId: number): Promise<boolean> {
    const rows = await this.roleRepo.query(
      'SELECT 1 FROM user_role WHERE user_id = $1 AND role_id = $2 LIMIT 1',
      [userId, roleId],
    );
    return rows?.length > 0;
  }

  async permissionExists(permissionId: number): Promise<boolean> {
    const count = await this.permissionRepo.count({
      where: { id: permissionId },
    });
    return count > 0;
  }

  async isPermissionAssignedToRole(
    roleId: number,
    permissionId: number,
  ): Promise<boolean> {
    const rows = await this.roleRepo.query(
      'SELECT 1 FROM role_permission WHERE role_id = $1 AND permission_id = $2 LIMIT 1',
      [roleId, permissionId],
    );
    return rows?.length > 0;
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    await this.roleRepo.query(
      'INSERT INTO user_role (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, roleId],
    );
  }

  async unassignRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.roleRepo.query(
      'DELETE FROM user_role WHERE user_id = $1 AND role_id = $2',
      [userId, roleId],
    );
  }

  async assignPermissionToRole(
    roleId: number,
    permissionId: number,
  ): Promise<void> {
    await this.roleRepo
      .createQueryBuilder()
      .relation(RoleEntity, 'permissions')
      .of(roleId)
      .add(permissionId);
  }

  async unassignPermissionFromRole(
    roleId: number,
    permissionId: number,
  ): Promise<void> {
    await this.roleRepo
      .createQueryBuilder()
      .relation(RoleEntity, 'permissions')
      .of(roleId)
      .remove(permissionId);
  }
}
