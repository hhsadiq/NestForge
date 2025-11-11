import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/action.entity';
import { PermissionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/permission.entity';
import { SubjectEntity } from '@src/access-management/infrastructure/persistence/relational/entities/subject.entity';
import { PermissionSeedService } from '@src/database/seeds/relational/permission/permission-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionEntity, SubjectEntity, ActionEntity]),
  ],
  providers: [PermissionSeedService],
  exports: [PermissionSeedService],
})
export class PermissionSeedModule {}
