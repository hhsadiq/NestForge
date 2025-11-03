import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PermissionActionEnum } from '@src/access-management/enums/permission-actions.enum';
import { RolePermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role-permission.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';
import { TABLES } from '@src/common/constants';

@Entity({ name: TABLES.permission })
export class PermissionEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    type: 'enum',
    enum: PermissionActionEnum,
    enumName: 'permission_action_enum',
  })
  action: PermissionActionEnum;

  @ManyToOne(() => SubjectEntity, { eager: true })
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectEntity;

  @Column({ type: 'varchar', nullable: true })
  description?: string | null;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermissionEntity[];
}
