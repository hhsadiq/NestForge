import { Module } from '@nestjs/common';

import { AccessManagementModule } from '@src/access-management/access-management.module';
import { FilesModule } from '@src/files/files.module';
import { ViewsModule } from '@src/views/views.module';

import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    FilesModule,
    ViewsModule,
    AccessManagementModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
