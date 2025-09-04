import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { AuthorEntity } from '@src/authors/infrastructure/persistence/relational/entities/author.entity';
import { VerseEntity } from '@src/verses/infrastructure/persistence/relational/entities/verse.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.verseAuthor,
})
export class VerseAuthorEntity extends EntityRelationalHelper {
  @ManyToOne(() => AuthorEntity)
  @JoinColumn({ name: 'author_id' })
  author: AuthorEntity;

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
    name: 'author_id',
    type: 'int',
    nullable: false,
  })
  author_id: number;

  @Column({
    name: 'position',
    type: 'int',
    nullable: false,
  })
  position: number;

  @Column({
    name: 'role',
    type: 'varchar',
    nullable: true,
  })
  role?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
