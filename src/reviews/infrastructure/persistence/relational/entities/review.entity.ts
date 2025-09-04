import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { WorkflowStatusEntity } from '@src/workflow-statuses/infrastructure/persistence/relational/entities/workflow-status.entity';
import { ReviewerEntity } from '@src/reviewers/infrastructure/persistence/relational/entities/reviewer.entity';
import { TranslationEntity } from '@src/translations/infrastructure/persistence/relational/entities/translation.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.review,
})
export class ReviewEntity extends EntityRelationalHelper {
  @ManyToOne(() => WorkflowStatusEntity)
  @JoinColumn({ name: 'workflow_status_id' })
  workflowStatus: WorkflowStatusEntity;

  @ManyToOne(() => ReviewerEntity)
  @JoinColumn({ name: 'reviewer_id' })
  reviewer: ReviewerEntity;

  @ManyToOne(() => TranslationEntity)
  @JoinColumn({ name: 'translation_id' })
  translation: TranslationEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'translation_id',
    type: 'int',
    nullable: false,
  })
  translation_id: number;

  @Column({
    name: 'reviewer_id',
    type: 'int',
    nullable: false,
  })
  reviewer_id: number;

  @Column({
    name: 'workflow_status_id',
    type: 'int',
    nullable: false,
  })
  workflow_status_id: number;

  @Column({
    name: 'note',
    type: 'varchar',
    nullable: true,
  })
  note?: string;

  @Column({
    name: 'closed_at',
    type: 'timestamp',
    nullable: true,
  })
  closed_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
