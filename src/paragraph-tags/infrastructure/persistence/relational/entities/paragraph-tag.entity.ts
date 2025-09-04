import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { TagEntity } from '@src/tags/infrastructure/persistence/relational/entities/tag.entity';
import { ParagraphEntity } from '@src/paragraphs/infrastructure/persistence/relational/entities/paragraph.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.paragraphTag,
})
export class ParagraphTagEntity extends EntityRelationalHelper {
  @ManyToOne(() => TagEntity)
  @JoinColumn({ name: 'tag_id' })
  tag: TagEntity;

  @ManyToOne(() => ParagraphEntity)
  @JoinColumn({ name: 'paragraph_id' })
  paragraph: ParagraphEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'paragraph_id',
    type: 'int',
    nullable: false,
  })
  paragraph_id: number;

  @Column({
    name: 'tag_id',
    type: 'int',
    nullable: false,
  })
  tag_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
