import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PermissionEntity } from './permission.entity';

@Entity({ name: 'subject' })
export class SubjectEntity {
  @PrimaryGeneratedColumn('identity')
  id!: number;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @OneToMany(() => PermissionEntity, (p) => p.subject)
  permissions!: PermissionEntity[];
}
