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
import { PoemEntity } from '@src/poems/infrastructure/persistence/relational/entities/poem.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.poemTag,
})
export class PoemTagEntity extends EntityRelationalHelper {
  @ManyToOne(() => TagEntity)
  @JoinColumn({ name: 'tag_id' })
  tag: TagEntity;

  @ManyToOne(() => PoemEntity)
  @JoinColumn({ name: 'poem_id' })
  poem: PoemEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'poem_id',
    type: 'int',
    nullable: false,
  })
  poem_id: number;

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
