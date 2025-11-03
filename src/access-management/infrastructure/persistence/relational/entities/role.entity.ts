import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RolePermissionEntity } from './role-permission.entity';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description?: string | null;

  @OneToMany(
    () => RolePermissionEntity,
    (rolePermission) => rolePermission.role,
    { cascade: true },
  )
  rolePermissions: RolePermissionEntity[];
}
