import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { AuthProvidersEnum } from '@src/auth/auth-providers.enum';
import { TABLES } from '@src/common/constants';
import { FileEntity } from '@src/files/infrastructure/persistence/relational/entities/file.entity';
import { RoleEntity } from '@src/roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '@src/statuses/infrastructure/persistence/relational/entities/status.entity';
import { EntityRelationalHelper } from '@src/utils/relational-entity-helper';

// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.

@Entity({
  name: TABLES.user,
})
export class UserEntity extends EntityRelationalHelper {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: true,
  })
  username: string | null;

  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  public previous_password?: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previous_password = this.password;
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: String, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  social_id?: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  first_name: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  last_name: string | null;

  @OneToOne(() => FileEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'photo_id' })
  photo?: FileEntity | null;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'role_id' })
  role?: RoleEntity | null;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'status_id' })
  status?: StatusEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
