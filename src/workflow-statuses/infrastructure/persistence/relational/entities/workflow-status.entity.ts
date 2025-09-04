import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.workflowStatus,
})
export class WorkflowStatusEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    nullable: false,
  })
  code: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
  })
  name?: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
