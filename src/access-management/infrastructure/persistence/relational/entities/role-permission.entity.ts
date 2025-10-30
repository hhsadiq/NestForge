import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';
import { TABLES } from '@src/common/constants';

@Entity({ name: TABLES.rolePermission })
@Index(['role_id', 'permission_id'], { unique: true })
export class RolePermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'role_id', type: 'int' })
  role_id: number;

  @Column({ name: 'permission_id', type: 'int' })
  permission_id: number;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;
}
