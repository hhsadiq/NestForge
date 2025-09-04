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
  name: TABLES.translator,
})
export class TranslatorEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'translator_type',
    type: 'varchar',
    nullable: false,
  })
  translator_type: string;

  @Column({
    name: 'display_name',
    type: 'varchar',
    nullable: false,
  })
  display_name: string;

  @Column({
    name: 'sort_name',
    type: 'varchar',
    nullable: true,
  })
  sort_name?: string;

  @Column({
    name: 'bio',
    type: 'varchar',
    nullable: true,
  })
  bio?: string;

  @Column({
    name: 'note',
    type: 'varchar',
    nullable: true,
  })
  note?: string;

  @Column({
    name: 'slug',
    type: 'varchar',
    nullable: false,
  })
  slug: string;

  @Column({
    name: 'llm_provider_name',
    type: 'varchar',
    nullable: true,
  })
  llm_provider_name?: string;

  @Column({
    name: 'llm_provider_slug',
    type: 'varchar',
    nullable: true,
  })
  llm_provider_slug?: string;

  @Column({
    name: 'llm_provider_website',
    type: 'varchar',
    nullable: true,
  })
  llm_provider_website?: string;

  @Column({
    name: 'llm_model_name',
    type: 'varchar',
    nullable: true,
  })
  llm_model_name?: string;

  @Column({
    name: 'llm_model_slug',
    type: 'varchar',
    nullable: true,
  })
  llm_model_slug?: string;

  @Column({
    name: 'llm_model_version',
    type: 'varchar',
    nullable: true,
  })
  llm_model_version?: string;

  @Column({
    name: 'llm_model_family',
    type: 'varchar',
    nullable: true,
  })
  llm_model_family?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
