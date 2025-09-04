import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { LanguageEntity } from '@src/languages/infrastructure/persistence/relational/entities/language.entity';
import { SectionEntity } from '@src/sections/infrastructure/persistence/relational/entities/section.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.paragraph,
})
export class ParagraphEntity extends EntityRelationalHelper {
  @ManyToOne(() => LanguageEntity)
  @JoinColumn({ name: 'language_id' })
  language: LanguageEntity;

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
    name: 'language_id',
    type: 'int',
    nullable: true,
  })
  language_id?: number;

  @Column({
    name: 'position',
    type: 'int',
    nullable: false,
  })
  position: number;

  @Column({
    name: 'body',
    type: 'varchar',
    nullable: false,
  })
  body: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
