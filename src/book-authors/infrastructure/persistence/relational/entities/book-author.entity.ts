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
import { BookEntity } from '@src/books/infrastructure/persistence/relational/entities/book.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.bookAuthor,
})
export class BookAuthorEntity extends EntityRelationalHelper {
  @ManyToOne(() => AuthorEntity)
  @JoinColumn({ name: 'author_id' })
  author: AuthorEntity;

  @ManyToOne(() => BookEntity)
  @JoinColumn({ name: 'book_id' })
  book: BookEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'book_id',
    type: 'int',
    nullable: false,
  })
  book_id: number;

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
