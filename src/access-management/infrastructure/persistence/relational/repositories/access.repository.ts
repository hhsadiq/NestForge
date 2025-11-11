import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action } from '@src/access-management/domain/action';
import { Permission } from '@src/access-management/domain/permission';
import { Role } from '@src/access-management/domain/role';
import { Subject } from '@src/access-management/domain/subject';
import { AccessAbstractRepository } from '@src/access-management/infrastructure/persistence/access.abstract.repository';
import { ActionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/action.entity';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';
import { ActionMapper } from '@src/access-management/infrastructure/persistence/relational/mappers/action.mapper';
import { PermissionMapper } from '@src/access-management/infrastructure/persistence/relational/mappers/permission.mapper';
import { RoleMapper } from '@src/access-management/infrastructure/persistence/relational/mappers/role.mapper';
import { SubjectMapper } from '@src/access-management/infrastructure/persistence/relational/mappers/subject.mapper';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class AccessRelationalRepository extends AccessAbstractRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
    @InjectRepository(ActionEntity)
    private readonly actionRepository: Repository<ActionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super();
  }

  async findRolesByUserId(userId: number): Promise<Role[]> {
    const roles = await this.roleRepository
      .createQueryBuilder('role')
      .innerJoin(
        'user_role',
        'ur',
        'ur.role_id = role.id AND ur.user_id = :userId',
        {
          userId,
        },
      )
      .getMany();
    return roles.map(RoleMapper.toDomain);
  }

  async findPermissionsByRoleIds(roleIds: number[]): Promise<Permission[]> {
    if (!roleIds?.length) return [];
    // Select distinct permissions joined via role_permission bridge
    const qb = this.permissionRepository
      .createQueryBuilder('permission')
      .innerJoin('role_permission', 'rp', 'rp.permission_id = permission.id')
      .leftJoinAndSelect('permission.subject', 'subject')
      .leftJoinAndSelect('permission.action', 'action')
      .where('rp.role_id IN (:...roleIds)', { roleIds });

    const perms = await qb.getMany();
    // Deduplicate by id
    const unique = new Map<number, PermissionEntity>();
    for (const p of perms) unique.set(p.id, p);
    return Array.from(unique.values()).map(PermissionMapper.toDomain);
  }

  async findRoleByName(name: string): Promise<Role | null> {
    const r = await this.roleRepository.findOne({ where: { name } });
    return r ? RoleMapper.toDomain(r) : null;
  }

  async findSubjectByName(name: string): Promise<Subject | null> {
    const entity = await this.subjectRepository.findOne({ where: { name } });
    return entity ? SubjectMapper.toDomain(entity) : null;
  }

  async createSubject(name: string): Promise<Subject> {
    const saved = await this.subjectRepository.save(
      this.subjectRepository.create({ name }),
    );
    return SubjectMapper.toDomain(saved);
  }

  async findActionByName(name: string): Promise<Action | null> {
    const entity = await this.actionRepository.findOne({
      where: { name },
    });
    return entity ? ActionMapper.toDomain(entity) : null;
  }

  async findAllRoles(): Promise<Role[]> {
    const roles = await this.roleRepository.find();
    return roles.map((r) => RoleMapper.toDomain(r));
  }

  async findAllPermissions(): Promise<Permission[]> {
    const perms = await this.permissionRepository.find({
      relations: ['subject', 'action'],
    });
    return perms.map(PermissionMapper.toDomain);
  }

  async findPermissionByActionAndSubject(
    actionId: number,
    subjectId: number,
  ): Promise<Permission | null> {
    const existing = await this.permissionRepository.findOne({
      where: {
        action_id: actionId,
        subject_id: subjectId,
      },
      relations: ['subject', 'action'],
    });
    return existing ? PermissionMapper.toDomain(existing) : null;
  }

  async createRole(createRole: Role): Promise<Role> {
    const entity = RoleMapper.toPersistence(createRole);
    const saved = await this.roleRepository.save(
      this.roleRepository.create(entity),
    );
    return RoleMapper.toDomain(saved);
  }

  async createPermission(
    createPermission: Omit<Permission, 'id'>,
  ): Promise<Permission> {
    const entity = PermissionMapper.toPersistence(
      createPermission as Permission,
    );
    const saved = await this.permissionRepository.save(
      this.permissionRepository.create(entity),
    );
    return PermissionMapper.toDomain(saved);
  }

  async userExists(userId: number): Promise<boolean> {
    const count = await this.userRepository.count({ where: { id: userId } });
    return count > 0;
  }

  async roleExists(roleId: number): Promise<boolean> {
    const count = await this.roleRepository.count({ where: { id: roleId } });
    return count > 0;
  }

  async isUserRoleAssigned(userId: number, roleId: number): Promise<boolean> {
    const rows = await this.roleRepository.query(
      'SELECT 1 FROM user_role WHERE user_id = $1 AND role_id = $2 LIMIT 1',
      [userId, roleId],
    );
    return rows?.length > 0;
  }

  async permissionExists(permissionId: number): Promise<boolean> {
    const count = await this.permissionRepository.count({
      where: { id: permissionId },
    });
    return count > 0;
  }

  async isPermissionAssignedToRole(
    roleId: number,
    permissionId: number,
  ): Promise<boolean> {
    const rows = await this.roleRepository.query(
      'SELECT 1 FROM role_permission WHERE role_id = $1 AND permission_id = $2 LIMIT 1',
      [roleId, permissionId],
    );
    return rows?.length > 0;
  }

  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    await this.roleRepository.query(
      'INSERT INTO user_role (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, roleId],
    );
  }

  async unassignRoleFromUser(userId: number, roleId: number): Promise<void> {
    await this.roleRepository.query(
      'DELETE FROM user_role WHERE user_id = $1 AND role_id = $2',
      [userId, roleId],
    );
  }

  async assignPermissionToRole(
    roleId: number,
    permissionId: number,
  ): Promise<void> {
    await this.roleRepository.query(
      'INSERT INTO role_permission (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [roleId, permissionId],
    );
  }

  async unassignPermissionFromRole(
    roleId: number,
    permissionId: number,
  ): Promise<void> {
    await this.roleRepository.query(
      'DELETE FROM role_permission WHERE role_id = $1 AND permission_id = $2',
      [roleId, permissionId],
    );
  }
}
