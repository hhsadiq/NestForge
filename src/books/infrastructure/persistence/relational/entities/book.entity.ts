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
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.book,
})
export class BookEntity extends EntityRelationalHelper {
  @ManyToOne(() => LanguageEntity)
  @JoinColumn({ name: 'original_language_id' })
  originalLanguage: LanguageEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'title',
    type: 'varchar',
    nullable: false,
  })
  title: string;

  @Column({
    name: 'original_language_id',
    type: 'int',
    nullable: true,
  })
  original_language_id?: number;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'published_year',
    type: 'int',
    nullable: true,
  })
  published_year?: number;

  @Column({
    name: 'slug',
    type: 'varchar',
    nullable: false,
  })
  slug: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
