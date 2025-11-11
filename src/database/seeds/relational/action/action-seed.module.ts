import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActionEntity } from '@src/access-management/infrastructure/persistence/relational/entities/action.entity';
import { ActionSeedService } from '@src/database/seeds/relational/action/action-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActionEntity])],
  providers: [ActionSeedService],
  exports: [ActionSeedService],
})
export class ActionSeedModule {}
