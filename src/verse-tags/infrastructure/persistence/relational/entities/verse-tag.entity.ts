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
import { VerseEntity } from '@src/verses/infrastructure/persistence/relational/entities/verse.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.verseTag,
})
export class VerseTagEntity extends EntityRelationalHelper {
  @ManyToOne(() => TagEntity)
  @JoinColumn({ name: 'tag_id' })
  tag: TagEntity;

  @ManyToOne(() => VerseEntity)
  @JoinColumn({ name: 'verse_id' })
  verse: VerseEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'verse_id',
    type: 'int',
    nullable: false,
  })
  verse_id: number;

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
