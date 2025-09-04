import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { FeedbackPresetEntity } from '@src/feedback-presets/infrastructure/persistence/relational/entities/feedback-preset.entity';
import { ReviewEntity } from '@src/reviews/infrastructure/persistence/relational/entities/review.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.reviewFeedback,
})
export class ReviewFeedbackEntity extends EntityRelationalHelper {
  @ManyToOne(() => FeedbackPresetEntity)
  @JoinColumn({ name: 'feedback_preset_id' })
  feedbackPreset: FeedbackPresetEntity;

  @ManyToOne(() => ReviewEntity)
  @JoinColumn({ name: 'review_id' })
  review: ReviewEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'review_id',
    type: 'int',
    nullable: false,
  })
  review_id: number;

  @Column({
    name: 'feedback_preset_id',
    type: 'int',
    nullable: false,
  })
  feedback_preset_id: number;

  @Column({
    name: 'note',
    type: 'varchar',
    nullable: true,
  })
  note?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
