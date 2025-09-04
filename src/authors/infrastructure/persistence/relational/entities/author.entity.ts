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
  name: TABLES.author,
})
export class AuthorEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('identity')
  id: number;

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
    name: 'slug',
    type: 'varchar',
    nullable: false,
  })
  slug: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: true,
  })
  email?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
