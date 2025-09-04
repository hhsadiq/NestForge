import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { MediaPlatformEntity } from '@src/media-platforms/infrastructure/persistence/relational/entities/media-platform.entity';
import { PoemEntity } from '@src/poems/infrastructure/persistence/relational/entities/poem.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';
import { TABLES } from '@src/common/constants';

@Entity({
  name: TABLES.poemMedia,
})
export class PoemMediaEntity extends EntityRelationalHelper {
  @ManyToOne(() => MediaPlatformEntity)
  @JoinColumn({ name: 'media_platform_id' })
  mediaPlatform: MediaPlatformEntity;

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
    name: 'media_platform_id',
    type: 'int',
    nullable: false,
  })
  media_platform_id: number;

  @Column({
    name: 'link',
    type: 'varchar',
    nullable: false,
  })
  link: string;

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
