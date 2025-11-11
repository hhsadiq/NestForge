import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessAbstractRepository } from '@src/access-management/infrastructure/persistence/access.abstract.repository';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';

import { ActionEntity } from './entities/action.entity';
import { PermissionEntity } from './entities/permission.entity';
import { RoleEntity } from './entities/role.entity';
import { SubjectEntity } from './entities/subject.entity';
import { AccessRelationalRepository } from './repositories/access.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      SubjectEntity,
      ActionEntity,
      UserEntity,
    ]),
  ],
  providers: [
    {
      provide: AccessAbstractRepository,
      useClass: AccessRelationalRepository,
    },
  ],
  exports: [AccessAbstractRepository],
})
export class RelationalAccessPersistenceModule {}
