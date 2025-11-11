import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ActionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/action.entity';
import { RolePermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role-permission.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';
import { TABLES } from '@src/common/constants';

@Entity({ name: TABLES.permission })
export class PermissionEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'subject_id', type: 'int' })
  subject_id: number;

  @Column({ name: 'action_id', type: 'int' })
  action_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => SubjectEntity, { eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectEntity;

  @ManyToOne(() => ActionEntity, { eager: true })
  @JoinColumn({ name: 'action_id' })
  action: ActionEntity;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermissionEntity[];
}
