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
import { SectionEntity } from '@src/sections/infrastructure/persistence/relational/entities/section.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.sectionTag,
})
export class SectionTagEntity extends EntityRelationalHelper {
  @ManyToOne(() => TagEntity)
  @JoinColumn({ name: 'tag_id' })
  tag: TagEntity;

  @ManyToOne(() => SectionEntity)
  @JoinColumn({ name: 'section_id' })
  section: SectionEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'section_id',
    type: 'int',
    nullable: false,
  })
  section_id: number;

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
