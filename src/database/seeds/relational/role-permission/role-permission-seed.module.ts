import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { RolePermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role-permission.entity';
import { RoleEntity } from '@src/access-management/infrastructure/persistence/relational/entities/role.entity';
import { RolePermissionSeedService } from '@src/database/seeds/relational/role-permission/role-permission-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      RolePermissionEntity,
    ]),
  ],
  providers: [RolePermissionSeedService],
  exports: [RolePermissionSeedService],
})
export class RolePermissionSeedModule {}
