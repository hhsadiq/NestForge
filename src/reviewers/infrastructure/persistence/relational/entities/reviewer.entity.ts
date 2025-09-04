import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { TranslatorEntity } from '@src/translators/infrastructure/persistence/relational/entities/translator.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.reviewer,
})
export class ReviewerEntity extends EntityRelationalHelper {
  @ManyToOne(() => TranslatorEntity)
  @JoinColumn({ name: 'translator_id' })
  translator: TranslatorEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'display_name',
    type: 'varchar',
    nullable: false,
  })
  display_name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    name: 'translator_id',
    type: 'int',
    nullable: true,
  })
  translator_id?: number;

  @Column({
    name: 'note',
    type: 'varchar',
    nullable: true,
  })
  note?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
