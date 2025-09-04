import { Module } from '@nestjs/common';

import { WorkflowStatusesService } from './workflow-statuses.service';
import { WorkflowStatusesController } from './workflow-statuses.controller';
import { RelationalWorkflowStatusPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalWorkflowStatusPersistenceModule],
  controllers: [WorkflowStatusesController],
  providers: [WorkflowStatusesService],
  exports: [WorkflowStatusesService, RelationalWorkflowStatusPersistenceModule],
})
export class WorkflowStatusesModule {}
