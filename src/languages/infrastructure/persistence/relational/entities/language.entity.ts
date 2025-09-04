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
  name: TABLES.language,
})
export class LanguageEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'code',
    type: 'varchar',
    nullable: false,
  })
  code: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'direction',
    type: 'varchar',
    nullable: false,
  })
  direction: string;

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
