import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { TABLES } from '@src/common/constants';
import { UserDeviceEntity } from '@src/users/infrastructure/persistence/relational/entities/user-device.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

@Entity({
  name: TABLES.biometricChallenge,
})
export class BiometricChallengeEntity extends EntityRelationalHelper {
  @Index()
  @PrimaryGeneratedColumn('identity')
  @Expose({ groups: ['admin'] })
  id: number;

  @ManyToOne(() => UserDeviceEntity)
  @JoinColumn({ name: 'user_device_id' })
  user_device: UserDeviceEntity;

  @Column({ type: 'varchar' })
  challenge: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'timestamp' })
  expires_at: Date;
}
