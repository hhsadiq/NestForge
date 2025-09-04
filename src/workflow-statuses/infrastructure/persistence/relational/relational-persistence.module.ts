import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkflowStatusAbstractRepository } from '@src/workflow-statuses/infrastructure/persistence/workflow-status.abstract.repository';

import { WorkflowStatusRelationalRepository } from './repositories/workflow-status.repository';
import { WorkflowStatusEntity } from './entities/workflow-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkflowStatusEntity])],
  providers: [
    {
      provide: WorkflowStatusAbstractRepository,
      useClass: WorkflowStatusRelationalRepository,
    },
  ],
  exports: [WorkflowStatusAbstractRepository],
})
export class RelationalWorkflowStatusPersistenceModule {}
