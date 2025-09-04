import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { PoemEntity } from '@src/poems/infrastructure/persistence/relational/entities/poem.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.stanza,
})
export class StanzaEntity extends EntityRelationalHelper {
  @ManyToOne(() => StanzaEntity)
  @JoinColumn({ name: 'parent_stanza_id' })
  parentStanza: StanzaEntity;

  @ManyToOne(() => PoemEntity)
  @JoinColumn({ name: 'poem_id' })
  poem: PoemEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'poem_id',
    type: 'int',
    nullable: false,
  })
  poem_id: number;

  @Column({
    name: 'parent_stanza_id',
    type: 'int',
    nullable: true,
  })
  parent_stanza_id?: number;

  @Column({
    name: 'label',
    type: 'varchar',
    nullable: true,
  })
  label?: string;

  @Column({
    name: 'position',
    type: 'int',
    nullable: false,
  })
  position: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
