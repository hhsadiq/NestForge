import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { MeterEntity } from '@src/meters/infrastructure/persistence/relational/entities/meter.entity';
import { PoemFormEntity } from '@src/poem-forms/infrastructure/persistence/relational/entities/poem-form.entity';
import { LanguageEntity } from '@src/languages/infrastructure/persistence/relational/entities/language.entity';
import { SectionEntity } from '@src/sections/infrastructure/persistence/relational/entities/section.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.poem,
})
export class PoemEntity extends EntityRelationalHelper {
  @ManyToOne(() => MeterEntity)
  @JoinColumn({ name: 'meter_id' })
  meter: MeterEntity;

  @ManyToOne(() => PoemFormEntity)
  @JoinColumn({ name: 'poem_form_id' })
  poemForm: PoemFormEntity;

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
    name: 'title',
    type: 'varchar',
    nullable: true,
  })
  title?: string;

  @Column({
    name: 'slug',
    type: 'varchar',
    nullable: false,
  })
  slug: string;

  @Column({
    name: 'poem_form_id',
    type: 'int',
    nullable: true,
  })
  poem_form_id?: number;

  @Column({
    name: 'meter_id',
    type: 'int',
    nullable: true,
  })
  meter_id?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
