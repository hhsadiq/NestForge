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
import { TranslatorEntity } from '@src/translators/infrastructure/persistence/relational/entities/translator.entity';
import { LanguageEntity } from '@src/languages/infrastructure/persistence/relational/entities/language.entity';
import { VerseEntity } from '@src/verses/infrastructure/persistence/relational/entities/verse.entity';
import { ParagraphEntity } from '@src/paragraphs/infrastructure/persistence/relational/entities/paragraph.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.translation,
})
export class TranslationEntity extends EntityRelationalHelper {
  @ManyToOne(() => TranslationEntity)
  @JoinColumn({ name: 'source_translation_id' })
  sourceTranslation: TranslationEntity;

  @ManyToOne(() => WorkflowStatusEntity)
  @JoinColumn({ name: 'workflow_status_id' })
  workflowStatus: WorkflowStatusEntity;

  @ManyToOne(() => TranslatorEntity)
  @JoinColumn({ name: 'translator_id' })
  translator: TranslatorEntity;

  @ManyToOne(() => LanguageEntity)
  @JoinColumn({ name: 'language_id' })
  language: LanguageEntity;

  @ManyToOne(() => VerseEntity)
  @JoinColumn({ name: 'verse_id' })
  verse: VerseEntity;

  @ManyToOne(() => ParagraphEntity)
  @JoinColumn({ name: 'paragraph_id' })
  paragraph: ParagraphEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'paragraph_id',
    type: 'int',
    nullable: true,
  })
  paragraph_id?: number;

  @Column({
    name: 'verse_id',
    type: 'int',
    nullable: true,
  })
  verse_id?: number;

  @Column({
    name: 'language_id',
    type: 'int',
    nullable: false,
  })
  language_id: number;

  @Column({
    name: 'translator_id',
    type: 'int',
    nullable: false,
  })
  translator_id: number;

  @Column({
    name: 'body',
    type: 'varchar',
    nullable: false,
  })
  body: string;

  @Column({
    name: 'version',
    type: 'int',
    nullable: false,
  })
  version: number;

  @Column({
    name: 'is_primary',
    type: 'boolean',
    nullable: false,
  })
  is_primary: boolean;

  @Column({
    name: 'note',
    type: 'varchar',
    nullable: true,
  })
  note?: string;

  @Column({
    name: 'workflow_status_id',
    type: 'int',
    nullable: false,
  })
  workflow_status_id: number;

  @Column({
    name: 'source_translation_id',
    type: 'int',
    nullable: true,
  })
  source_translation_id?: number;

  @Column({
    name: 'generation_meta',
    type: 'jsonb',
    nullable: true,
  })
  generation_meta?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
