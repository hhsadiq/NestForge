import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { StanzaEntity } from '@src/stanzas/infrastructure/persistence/relational/entities/stanza.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.verse,
})
export class VerseEntity extends EntityRelationalHelper {
  @ManyToOne(() => StanzaEntity)
  @JoinColumn({ name: 'stanza_id' })
  stanza: StanzaEntity;

  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({
    name: 'stanza_id',
    type: 'int',
    nullable: false,
  })
  stanza_id: number;

  @Column({
    name: 'position',
    type: 'int',
    nullable: false,
  })
  position: number;

  @Column({
    name: 'body',
    type: 'varchar',
    nullable: false,
  })
  body: string;

  @Column({
    name: 'couplet_index',
    type: 'int',
    nullable: true,
  })
  couplet_index?: number;

  @Column({
    name: 'position_in_couplet',
    type: 'int',
    nullable: true,
  })
  position_in_couplet?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
