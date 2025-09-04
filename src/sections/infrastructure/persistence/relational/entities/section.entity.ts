import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { BookEntity } from '@src/books/infrastructure/persistence/relational/entities/book.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.section,
})
export class SectionEntity extends EntityRelationalHelper {
  @ManyToOne(() => SectionEntity)
  @JoinColumn({ name: 'parent_section_id' })
  parentSection: SectionEntity;

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
    name: 'parent_section_id',
    type: 'int',
    nullable: true,
  })
  parent_section_id?: number;

  @Column({
    name: 'title',
    type: 'varchar',
    nullable: true,
  })
  title?: string;

  @Column({
    name: 'position',
    type: 'int',
    nullable: false,
  })
  position: number;

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
