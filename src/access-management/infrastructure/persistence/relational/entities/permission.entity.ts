import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';
import { TABLES } from '@src/common/constants';

export enum PermissionAction {
  manage = 'manage',
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
}

@Entity({ name: TABLES.permission })
@Index(['action', 'subject'], { unique: true })
export class PermissionEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'enum',
    enum: PermissionAction,
    enumName: 'permission_action_enum',
  })
  action: PermissionAction;

  @ManyToOne(() => SubjectEntity, { eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectEntity;

  @Column({ type: 'varchar', nullable: true })
  description?: string | null;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles!: RoleEntity[];
}
