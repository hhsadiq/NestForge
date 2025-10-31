import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PermissionActionEnum } from '@src/access-management/enums/permission-actions.enum';
import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';
import { TABLES } from '@src/common/constants';

@Entity({ name: TABLES.permission })
@Index(['action', 'subject'], { unique: true })
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

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
